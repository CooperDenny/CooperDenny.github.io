// The three hero charts. Each scene owns its own state and draws one frame at a time; the runner
// (lib/charts/runner.ts) drives it. All data is simulated in the browser: illustrative only, no
// player and no real result (see docs/design-system.md#the-chart-console).

import type { ChartScene } from '@/content/types';
import {
  TAU,
  clamp,
  drawBall,
  easeOut,
  fieldLine,
  gauss,
  label,
  pickWeighted,
  rgba,
  type Palette,
} from '@/lib/charts/draw';

/** What a scene reports after each event: a row count and a one-line readout. */
export type ChartEvent = { rows: number; text: string };

/** A clicked point, in the scene's own coordinates (pitch: line, length; wagon: angle, runs; oval: x, y). */
export type Target = { a: number; b: number };

export type Scene = {
  /** Seconds between events once the opening burst is done. */
  interval: number;
  /** Events fired quickly on start, so the chart fills fast. */
  burst: number;
  layout(w: number, h: number, dpr: number): void;
  draw(c: CanvasRenderingContext2D, dt: number): void;
  spawn(t?: Target): void;
  busy(): boolean;
  pick(x: number, y: number): Target | null;
  /** Fills the chart instantly (reduced motion). */
  seed(n: number): ChartEvent;
};

export type SceneOptions = { compact?: boolean };
type Emit = (e: ChartEvent) => void;
type Point = { x: number; y: number };

/* ------------------------------------------------------------------ Test match pitch map */

const BANDS = [
  { name: 'short', from: 0.3, to: 0.58 },
  { name: 'good', from: 0.58, to: 0.72 },
  { name: 'full', from: 0.72, to: 0.9 },
  { name: 'yorker', from: 0.9, to: 1.0 },
];
function lengthOf(z: number) {
  const band = BANDS.find((b) => z >= b.from && z < b.to);
  if (band) return `${band.name} length`;
  return z < 0.3 ? 'bouncer' : 'full toss';
}
const lineOf = (x: number) => (x > 0.11 ? 'outside off' : x < -0.11 ? 'down leg' : 'on the stumps');

type Delivery = { t: number; rx: number; xb: number; zb: number; xe: number; pre: number; post: number; bounced: boolean; trail: Point[] };

function pitchMap(col: Palette, emit: Emit, o: SceneOptions): Scene {
  const compact = !!o.compact;
  let W = 1;
  let H = 1;
  let dpr = 1;
  let P = { dNear: 1, dFar: 2.7, gh: 1, horizon: 0, cx: 0, hw: 1 };
  const dots: { x: number; z: number }[] = [];
  const rings: { x: number; z: number; t: number }[] = [];
  const balls: Delivery[] = [];
  let rows = 0;
  const heat = document.createElement('canvas');
  const hctx = heat.getContext('2d') as CanvasRenderingContext2D;

  const depth = (z: number) => P.dNear + (1 - z) * (P.dFar - P.dNear);
  function project(x: number, z: number, h = 0) {
    const d = depth(z);
    return { x: P.cx + (x * P.hw) / d, y: P.horizon + (P.gh - h * P.hw) / d, s: P.hw / d };
  }
  function quad(c: CanvasRenderingContext2D, pts: Point[], fill: string) {
    c.beginPath();
    c.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
    c.closePath();
    c.fillStyle = fill;
    c.fill();
  }
  function across(c: CanvasRenderingContext2D, z: number, x0: number, x1: number) {
    const a = project(x0, z);
    const b = project(x1, z);
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x, b.y);
    c.stroke();
  }
  function along(c: CanvasRenderingContext2D, x: number, z0: number, z1: number) {
    const a = project(x, z0);
    const b = project(x, z1);
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x, b.y);
    c.stroke();
  }
  function splat(c: CanvasRenderingContext2D, d: { x: number; z: number }, a: number) {
    const p = project(d.x, d.z);
    const rx = p.s * 0.24;
    c.save();
    c.translate(p.x * dpr, p.y * dpr);
    c.scale(1, 0.5);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, rx * dpr);
    g.addColorStop(0, rgba(col.accent, a));
    g.addColorStop(1, rgba(col.accent, 0));
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, rx * dpr, 0, TAU);
    c.fill();
    c.restore();
  }
  function rebuild() {
    hctx.clearRect(0, 0, heat.width, heat.height);
    dots.forEach((d, i) => splat(hctx, d, 0.05 + 0.12 * ((i + 1) / dots.length)));
  }
  function stumps(c: CanvasRenderingContext2D, z: number) {
    c.save();
    c.strokeStyle = rgba(col.onTurf, 0.95);
    c.lineCap = 'round';
    for (let k = -1; k <= 1; k++) {
      const a = project(k * 0.075, z, 0);
      const b = project(k * 0.075, z, 0.47);
      c.lineWidth = Math.max(1, a.s * 0.025);
      c.beginPath();
      c.moveTo(a.x, a.y);
      c.lineTo(b.x, b.y);
      c.stroke();
    }
    const l = project(-0.08, z, 0.48);
    const r = project(0.08, z, 0.48);
    c.lineWidth = Math.max(1, l.s * 0.018);
    c.beginPath();
    c.moveTo(l.x, l.y);
    c.lineTo(r.x, r.y);
    c.stroke();
    c.restore();
  }
  function newBall(t?: Target): Delivery {
    // Test-match discipline: mostly a good length in a fourth-stump channel, the odd yorker.
    const zb = t ? t.b : Math.random() < 0.12 ? clamp(0.93 + gauss() * 0.03, 0.86, 0.99) : clamp(0.64 + gauss() * 0.07, 0.34, 0.97);
    const xb = t ? t.a : clamp(0.16 + gauss() * 0.16, -0.85, 0.85);
    const rx = 0.28 + gauss() * 0.06;
    return { t: 0, rx, xb, zb, xe: xb + (xb - rx) * 0.25 + gauss() * 0.04, pre: 0.5 + (zb - 0.3) * 0.15, post: 0.26, bounced: false, trail: [] };
  }
  function pos(b: Delivery) {
    let u: number;
    let x: number;
    let z: number;
    let h: number;
    if (b.t < b.pre) {
      u = b.t / b.pre;
      x = b.rx + (b.xb - b.rx) * u;
      z = -0.02 + (b.zb + 0.02) * u;
      h = 1.45 * (1 - u) * (1 + 0.35 * u);
    } else {
      u = Math.min(1, (b.t - b.pre) / b.post);
      x = b.xb + (b.xe - b.xb) * u;
      z = b.zb + (1.04 - b.zb) * u;
      h = 0.6 * (2 * u - u * u) * (1 - b.zb * 0.35);
    }
    return { x, z, h, done: b.t >= b.pre + b.post };
  }
  function bounce(b: Delivery) {
    dots.push({ x: b.xb, z: b.zb });
    if (dots.length > 180) dots.shift();
    rows++;
    rebuild();
    rings.push({ x: b.xb, z: b.zb, t: 0 });
    emit({ rows, text: `→ ${lengthOf(b.zb)}, ${lineOf(b.xb)}` });
  }
  function drawDelivery(c: CanvasRenderingContext2D, b: Delivery) {
    const p = pos(b);
    const sp = project(p.x, p.z, p.h);
    const gp = project(p.x, p.z, 0);
    const r = Math.max(2.5, sp.s * 0.05);
    b.trail.push({ x: sp.x, y: sp.y });
    if (b.trail.length > 9) b.trail.shift();
    c.save();
    c.lineCap = 'round';
    for (let i = 1; i < b.trail.length; i++) {
      c.strokeStyle = rgba(col.onTurf, (i / b.trail.length) * 0.4);
      c.lineWidth = r * (i / b.trail.length) * 1.3;
      c.beginPath();
      c.moveTo(b.trail[i - 1].x, b.trail[i - 1].y);
      c.lineTo(b.trail[i].x, b.trail[i].y);
      c.stroke();
    }
    c.fillStyle = `rgba(0,0,0,${0.35 - Math.min(0.25, p.h * 0.18)})`;
    c.beginPath();
    c.ellipse(gp.x, gp.y, r * 1.1, r * 0.4, 0, 0, TAU);
    c.fill();
    c.restore();
    drawBall(c, col, sp.x, sp.y, r, false);
  }

  return {
    interval: 1.15,
    burst: 14,
    layout(w, h, d) {
      W = w;
      H = h;
      dpr = d;
      heat.width = Math.round(w * d);
      heat.height = Math.round(h * d);
      const dNear = 1;
      const dFar = compact ? 2.4 : 2.7;
      const top = H * (compact ? 0.12 : 0.1);
      const bottom = H * (compact ? 1.02 : 0.97);
      const dTop = dNear + 1.06 * (dFar - dNear);
      const dBot = dNear - 0.08 * (dFar - dNear);
      const gh = (bottom - top) / (1 / dBot - 1 / dTop);
      P = { dNear, dFar, gh, horizon: top - gh / dTop, cx: W * (compact ? 0.5 : 0.46), hw: Math.min(W * (compact ? 0.2 : 0.3), (bottom - top) * 0.62) * dBot };
      rebuild();
    },
    draw(c, dt) {
      if (!compact) {
        c.fillStyle = col.turf;
        c.fillRect(0, 0, W, H);
        for (let z = -3; z < 1.4; z += 0.5) quad(c, [project(-14, z), project(14, z), project(14, z + 0.25), project(-14, z + 0.25)], col.turfStripe);
        c.save();
        c.strokeStyle = rgba(col.onTurf, 0.55);
        c.lineWidth = 1.2;
        c.beginPath();
        for (let t = 0; t <= 64; t++) {
          const a = Math.PI * (t / 64);
          const pt = project(Math.cos(a) * 4.2, 0.5 - Math.sin(a) * 1.25);
          if (t === 0) c.moveTo(pt.x, pt.y);
          else c.lineTo(pt.x, pt.y);
        }
        c.stroke();
        c.restore();
      }
      quad(c, [project(-1, -0.06), project(1, -0.06), project(1, 1.08), project(-1, 1.08)], col.pitch);
      for (let i = 0; i < BANDS.length; i += 2) {
        const b = BANDS[i];
        quad(c, [project(-1, b.from), project(1, b.from), project(1, b.to), project(-1, b.to)], col.pitchStripe);
      }
      c.save();
      c.strokeStyle = rgba(col.ink, 0.2);
      c.lineWidth = 1;
      c.setLineDash([3, 4]);
      BANDS.forEach((b) => across(c, b.from, -1, 1));
      c.restore();
      c.save();
      c.strokeStyle = rgba(col.onTurf, 0.95);
      c.lineWidth = 1.4;
      for (const end of [0, 1]) {
        const pop = end ? 0.94 : 0.06;
        across(c, end, -0.9, 0.9);
        across(c, pop, -1.25, 1.25);
        along(c, -0.9, end ? pop : -0.04, end ? 1.04 : pop);
        along(c, 0.9, end ? pop : -0.04, end ? 1.04 : pop);
      }
      c.restore();
      stumps(c, 0);
      c.save();
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.drawImage(heat, 0, 0);
      c.restore();
      dots.forEach((d, i) => {
        const p = project(d.x, d.z);
        c.fillStyle = rgba(col.accent, 0.35 + 0.55 * ((i + 1) / dots.length));
        c.beginPath();
        c.ellipse(p.x, p.y, Math.max(1.6, p.s * 0.03), Math.max(0.9, p.s * 0.014), 0, 0, TAU);
        c.fill();
      });
      if (!compact) {
        BANDS.forEach((b) => {
          const q = project(1.38, (b.from + b.to) / 2);
          label(c, col, b.name.toUpperCase(), q.x + 6, q.y);
        });
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const g = rings[i];
        g.t += dt;
        const k = g.t / 0.7;
        if (k >= 1) {
          rings.splice(i, 1);
          continue;
        }
        const rp = project(g.x, g.z);
        const rr = rp.s * (0.05 + k * 0.3);
        c.save();
        c.strokeStyle = rgba(col.accent, 0.9 * (1 - k));
        c.lineWidth = 1.5;
        c.beginPath();
        c.ellipse(rp.x, rp.y, rr, rr * 0.45, 0, 0, TAU);
        c.stroke();
        c.restore();
      }
      const past: Delivery[] = [];
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.t += dt;
        if (!b.bounced && b.t >= b.pre) {
          b.bounced = true;
          bounce(b);
        }
        const p = pos(b);
        if (p.done) {
          balls.splice(i, 1);
          continue;
        }
        if (p.z >= 1) past.push(b);
        else drawDelivery(c, b);
      }
      stumps(c, 1);
      past.forEach((b) => drawDelivery(c, b));
    },
    spawn(t) {
      balls.push(newBall(t));
    },
    busy: () => balls.length > 0 || rings.length > 0,
    pick(sx, sy) {
      const inv = (sy - P.horizon) / P.gh;
      if (inv <= 0) return null;
      const d = 1 / inv;
      const z = 1 - (d - P.dNear) / (P.dFar - P.dNear);
      const x = ((sx - P.cx) * d) / P.hw;
      if (z < 0.15 || z > 1.02 || Math.abs(x) > 1.3) return null;
      return { a: clamp(x, -1, 1), b: clamp(z, 0.15, 1) };
    },
    seed(n) {
      for (let i = 0; i < n; i++) {
        const b = newBall();
        dots.push({ x: b.xb, z: b.zb });
      }
      rows = n;
      rebuild();
      return { rows, text: '' };
    },
  };
}

/* ------------------------------------------------------------------ Wagon wheel */

const REGIONS: [number, string][] = [
  [-170, 'fine leg'],
  [-112, 'square leg'],
  [-78, 'midwicket'],
  [-38, 'long-on'],
  [-8, 'straight'],
  [8, 'long-off'],
  [38, 'cover'],
  [78, 'point'],
  [112, 'third man'],
  [170, 'fine leg'],
];
function regionOf(deg: number) {
  for (let i = 1; i < REGIONS.length; i++) if (deg < REGIONS[i][0]) return REGIONS[i - 1][1];
  return 'fine leg';
}

type Shot = { th: number; r: number; d: number; t: number; dur: number };

function wagonWheel(col: Palette, emit: Emit): Scene {
  const BY = 0.17; // the batter, just below centre
  const ROPE = 0.95;
  let W = 1;
  let H = 1;
  let cx = 0;
  let cy = 0;
  let rx = 1;
  let ry = 1;
  const shots: Shot[] = [];
  const live: Shot[] = [];
  let balls = 0;
  let runs = 0;
  let fours = 0;
  let sixes = 0;

  const S = (nx: number, ny: number) => ({ x: cx + nx * rx, y: cy + ny * ry });
  function toRope(th: number) {
    const dy = -Math.cos(th);
    const b = BY * dy;
    const c = BY * BY - ROPE * ROPE;
    return -b + Math.sqrt(b * b - c);
  }
  function make(th: number, r: number): Shot {
    const tb = toRope(th);
    const d =
      r === 0 ? 0.06 : r === 1 ? tb * (0.3 + Math.random() * 0.22) : r === 2 ? tb * (0.55 + Math.random() * 0.2) : r === 3 ? tb * (0.78 + Math.random() * 0.1) : r === 4 ? tb : tb * 1.07;
    return { th, r, d, t: 0, dur: r === 6 ? 0.9 : 0.3 + d * 0.55 };
  }
  function newShot(t?: Target): Shot {
    if (t) return make(t.a, t.b);
    const r = pickWeighted<number>([
      [0.3, 0],
      [0.34, 1],
      [0.12, 2],
      [0.03, 3],
      [0.15, 4],
      [0.06, 6],
    ]);
    const deg = pickWeighted<number>([
      [0.42, 58 + gauss() * 28],
      [0.36, -62 + gauss() * 30],
      [0.12, gauss() * 12],
      [0.1, (Math.random() < 0.5 ? -1 : 1) * (138 + gauss() * 14)],
    ]);
    return make((clamp(deg, -178, 178) * Math.PI) / 180, r);
  }
  function endOf(s: Shot, u: number) {
    const d = s.d * u;
    return { nx: Math.sin(s.th) * d, ny: BY - Math.cos(s.th) * d };
  }
  function count(s: Shot) {
    balls++;
    runs += s.r;
    if (s.r === 4) fours++;
    if (s.r === 6) sixes++;
  }
  const tally = () => `${runs} runs · ${fours}×4 · ${sixes}×6`;
  function land(s: Shot) {
    count(s);
    if (s.r) {
      shots.push(s);
      if (shots.length > 90) shots.shift();
    }
    const deg = (s.th * 180) / Math.PI;
    const what = s.r === 0 ? 'dot ball' : s.r === 4 ? 'FOUR' : s.r === 6 ? 'SIX' : `${s.r} ${s.r === 1 ? 'run' : 'runs'}`;
    emit({ rows: balls, text: `→ ${what}${s.r ? ` to ${regionOf(deg)}` : ''} · ${tally()}` });
  }

  return {
    interval: 1.0,
    burst: 16,
    layout(w, h) {
      W = w;
      H = h;
      ry = H * 0.46;
      rx = Math.min(ry * 1.22, W * 0.47);
      cx = W / 2;
      cy = H / 2 + 2;
    },
    draw(c, dt) {
      c.fillStyle = col.turf;
      c.fillRect(0, 0, W, H);
      c.save();
      c.beginPath();
      c.ellipse(cx, cy, rx, ry, 0, 0, TAU);
      c.clip();
      c.fillStyle = col.turfStripe;
      for (let i = 0; i < 12; i += 2) c.fillRect(cx - rx + (i * 2 * rx) / 12, 0, (2 * rx) / 12, H);
      c.restore();
      c.save();
      c.strokeStyle = rgba(col.onTurf, 0.55);
      c.setLineDash([4, 5]);
      c.lineWidth = 1.2;
      c.beginPath();
      c.ellipse(cx, cy + BY * ry * 0.35, rx * 0.46, ry * 0.5, 0, 0, TAU);
      c.stroke();
      c.restore();
      c.save();
      c.strokeStyle = rgba(col.onTurf, 0.95);
      c.lineWidth = 2;
      c.beginPath();
      c.ellipse(cx, cy, rx * ROPE, ry * ROPE, 0, 0, TAU);
      c.stroke();
      c.restore();
      const pw = ry * 0.035;
      const p0 = S(0, -BY);
      const p1 = S(0, BY);
      c.fillStyle = col.pitch;
      c.fillRect(cx - pw, p0.y - ry * 0.02, pw * 2, p1.y - p0.y + ry * 0.04);
      c.save();
      c.strokeStyle = rgba(col.onTurf, 0.9);
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(cx - pw * 1.4, p0.y + ry * 0.02);
      c.lineTo(cx + pw * 1.4, p0.y + ry * 0.02);
      c.moveTo(cx - pw * 1.4, p1.y - ry * 0.02);
      c.lineTo(cx + pw * 1.4, p1.y - ry * 0.02);
      c.stroke();
      c.restore();
      label(c, col, 'OFF', cx + rx * 0.62, cy - ry * 0.02, 'center', 0.8);
      label(c, col, 'LEG', cx - rx * 0.62, cy - ry * 0.02, 'center', 0.8);
      const bat = S(0, BY);
      shots.forEach((s, i) => {
        const e = S(endOf(s, 1).nx, endOf(s, 1).ny);
        const big = s.r >= 4;
        fieldLine(c, bat.x, bat.y, e.x, e.y, rgba(col.onTurf, big ? 1 : 0.28 + 0.32 * ((i + 1) / shots.length)), big ? (s.r === 6 ? 3.4 : 2.4) : 1.1);
        if (s.r === 6) {
          c.save();
          c.strokeStyle = rgba(col.onTurf, 1);
          c.lineWidth = 1.5;
          c.beginPath();
          c.arc(e.x, e.y, 4.5, 0, TAU);
          c.stroke();
          c.restore();
        }
      });
      for (let i = live.length - 1; i >= 0; i--) {
        const L = live[i];
        L.t += dt;
        const u = Math.min(1, L.t / L.dur);
        const e = endOf(L, L.r === 6 ? u : easeOut(u));
        const B = S(e.nx, e.ny);
        if (L.r) fieldLine(c, bat.x, bat.y, B.x, B.y, rgba(col.onTurf, L.r >= 4 ? 1 : 0.85), L.r >= 4 ? 2.4 : 1.3);
        drawBall(c, col, B.x, B.y, 4.5 * (L.r === 6 ? 1 + 1.1 * Math.sin(Math.PI * u) : 1), true);
        if (u >= 1) {
          live.splice(i, 1);
          land(L);
        }
      }
      c.fillStyle = rgba(col.onTurf, 1);
      c.beginPath();
      c.arc(bat.x, bat.y, 2.5, 0, TAU);
      c.fill();
    },
    spawn(t) {
      live.push(newShot(t));
    },
    busy: () => live.length > 0,
    pick(sx, sy) {
      const dx = (sx - cx) / rx;
      const dy = (sy - cy) / ry - BY;
      const d = Math.hypot(dx, dy);
      if (d < 0.08) return null;
      const th = Math.atan2(dx, -dy);
      const f = d / toRope(th);
      return { a: th, b: f >= 0.97 ? (f >= 1.03 ? 6 : 4) : f > 0.75 ? 3 : f > 0.5 ? 2 : 1 };
    },
    seed(n) {
      for (let i = 0; i < n; i++) {
        const s = newShot();
        count(s);
        if (s.r) shots.push(s);
      }
      return { rows: balls, text: tally() };
    },
  };
}

/* ------------------------------------------------------------------ AFL disposal heatmap */

type Disposal = { sx: number; sy: number; ex: number; ey: number; kick: boolean; outcome: 'effective' | 'ineffective' | 'clanger'; t: number; dur: number; age: number };

function disposalHeatmap(col: Palette, emit: Emit): Scene {
  // Field model from FootyStatsApp: centre (0,0), x along the 160 m length, y across the 141 m width,
  // 50 m arcs, 50 m centre square, 10 m centre circle, 9 m × 6.4 m goal squares. The team kicks to the right.
  const L = 160;
  const WD = 141;
  const ARC = 50;
  const GX = 16;
  const GY = 15;
  let W = 1;
  let H = 1;
  let s = 1;
  let ox = 0;
  let oy = 0;
  const bins: number[] = new Array(GX * GY).fill(0);
  let max = 1;
  const arrows: Disposal[] = [];
  const live: Disposal[] = [];
  let rows = 0;
  let eff = 0;

  const S = (fx: number, fy: number) => ({ x: ox + fx * s, y: oy - fy * s });
  const inside = (fx: number, fy: number, k = 1) => (fx * fx) / (80 * 80) + (fy * fy) / (70.5 * 70.5) <= k;
  function bin(fx: number, fy: number) {
    const i = clamp(Math.floor(((fx + 80) / L) * GX), 0, GX - 1);
    const j = clamp(Math.floor(((fy + 70.5) / WD) * GY), 0, GY - 1);
    bins[j * GX + i]++;
    max = Math.max(max, bins[j * GX + i]);
  }
  function startPoint(): Point {
    let p: [number, number];
    let tries = 0;
    do {
      p = pickWeighted<[number, number]>([
        [0.32, [gauss() * 13, gauss() * 13]],
        [0.38, [36 + gauss() * 17, gauss() * 24]],
        [0.3, [-34 + gauss() * 19, gauss() * 27]],
      ]);
    } while (!inside(p[0], p[1], 0.9) && ++tries < 20);
    return { x: p[0], y: p[1] };
  }
  function make(st: Point): Disposal {
    const kick = Math.random() < 0.62;
    const len = kick ? clamp(34 + gauss() * 10, 15, 55) : clamp(6 + gauss() * 2.5, 2, 12);
    const ang = kick ? (st.x > 45 ? Math.atan2(-st.y, 80 - st.x) + gauss() * 0.3 : gauss() * 0.65) : gauss() * 1.4;
    let ex = st.x + Math.cos(ang) * len;
    let ey = st.y + Math.sin(ang) * len;
    for (let k = 0; !inside(ex, ey, 0.96) && k < 12; k++) {
      ex = st.x + (ex - st.x) * 0.85;
      ey = st.y + (ey - st.y) * 0.85;
    }
    const outcome = pickWeighted<Disposal['outcome']>([
      [0.7, 'effective'],
      [0.18, 'ineffective'],
      [0.12, 'clanger'],
    ]);
    return { sx: st.x, sy: st.y, ex, ey, kick, outcome, t: 0, dur: kick ? 0.55 : 0.28, age: 0 };
  }
  function drawArrow(c: CanvasRenderingContext2D, d: Disposal, u: number, alpha: number) {
    const a = S(d.sx, d.sy);
    const b = S(d.sx + (d.ex - d.sx) * u, d.sy + (d.ey - d.sy) * u);
    const good = d.outcome === 'effective';
    const color = rgba(col.onTurf, (good ? 0.95 : 0.75) * alpha);
    fieldLine(c, a.x, a.y, b.x, b.y, color, d.kick ? 2 : 1.5, good ? [] : [5, 4]);
    if (u >= 1) {
      c.save();
      c.fillStyle = color;
      c.translate(b.x, b.y);
      c.rotate(Math.atan2(b.y - a.y, b.x - a.x));
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-7, -3.5);
      c.lineTo(-7, 3.5);
      c.closePath();
      c.fill();
      c.restore();
    }
    c.save();
    c.fillStyle = rgba(col.onTurf, alpha);
    c.strokeStyle = rgba(col.ink, 0.35 * alpha);
    c.beginPath();
    c.arc(a.x, a.y, 2.6, 0, TAU);
    c.fill();
    c.stroke();
    c.restore();
  }
  function drawFooty(c: CanvasRenderingContext2D, d: Disposal, u: number) {
    const p = S(d.sx + (d.ex - d.sx) * u, d.sy + (d.ey - d.sy) * u);
    const lift = d.kick ? 1 + 0.8 * Math.sin(Math.PI * Math.min(1, d.t / d.dur)) : 1;
    c.save();
    c.translate(p.x, p.y);
    c.rotate(Math.atan2(-(d.ey - d.sy), d.ex - d.sx));
    c.shadowColor = 'rgba(0,0,0,.35)';
    c.shadowBlur = 4 * lift;
    c.shadowOffsetY = 2 * lift;
    const g = c.createRadialGradient(-1.5, -1.5, 0.5, 0, 0, 6 * lift);
    g.addColorStop(0, rgba(col.shine, 1));
    g.addColorStop(0.6, rgba(col.ball, 1));
    g.addColorStop(1, rgba(col.shade, 1));
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(0, 0, 5.5 * lift, 3.6 * lift, 0, 0, TAU);
    c.fill();
    c.restore();
  }
  function record(d: Disposal) {
    bin(d.sx, d.sy);
    rows++;
    if (d.outcome === 'effective') eff++;
  }
  const rate = () => `${Math.round((eff / Math.max(1, rows)) * 100)}% effective`;

  return {
    interval: 0.75,
    burst: 22,
    layout(w, h) {
      W = w;
      H = h;
      s = Math.min((W - 28) / L, (H - 24) / WD);
      ox = W / 2;
      oy = H / 2;
    },
    draw(c, dt) {
      c.fillStyle = col.turfStripe;
      c.fillRect(0, 0, W, H);
      const tl = S(-80, 70.5);
      c.save();
      c.beginPath();
      c.ellipse(ox, oy, 80 * s, 70.5 * s, 0, 0, TAU);
      c.clip();
      c.fillStyle = col.turf;
      c.fillRect(tl.x, tl.y, L * s, WD * s);
      c.fillStyle = col.turfStripe;
      for (let i = 1; i < 8; i += 2) c.fillRect(tl.x + (i * L * s) / 8, tl.y, (L * s) / 8, WD * s);
      // Heat: where each disposal started, binned like FootyStatsApp's disposal summary.
      const cw = (L * s) / GX;
      const ch = (WD * s) / GY;
      for (let j = 0; j < GY; j++) {
        for (let i = 0; i < GX; i++) {
          const v = bins[j * GX + i];
          if (!v) continue;
          c.fillStyle = rgba(col.onTurf, 0.08 + 0.55 * (v / max));
          c.fillRect(tl.x + i * cw + 0.5, tl.y + (GY - 1 - j) * ch + 0.5, cw - 1, ch - 1);
        }
      }
      c.strokeStyle = rgba(col.onTurf, 0.9);
      c.lineWidth = 1.2;
      for (const gx of [-80, 80]) {
        const g = S(gx, 0);
        c.beginPath();
        c.arc(g.x, g.y, ARC * s, 0, TAU);
        c.stroke();
      }
      c.restore();
      c.save();
      c.strokeStyle = rgba(col.onTurf, 0.9);
      c.lineWidth = 1.2;
      const sq = S(-25, 25);
      c.strokeRect(sq.x, sq.y, 50 * s, 50 * s);
      c.beginPath();
      c.arc(ox, oy, 10 * s, 0, TAU);
      c.stroke();
      c.fillStyle = rgba(col.onTurf, 1);
      c.beginPath();
      c.arc(ox, oy, 1.5, 0, TAU);
      c.fill();
      const g1 = S(-80, 4.5);
      const g2 = S(80 - 6.4, 4.5);
      c.strokeRect(g1.x, g1.y, 6.4 * s, 9 * s);
      c.strokeRect(g2.x, g2.y, 6.4 * s, 9 * s);
      c.lineWidth = 2;
      c.beginPath();
      c.ellipse(ox, oy, 80 * s, 70.5 * s, 0, 0, TAU);
      c.stroke();
      c.restore();
      label(c, col, 'ATTACKING →', ox + 80 * s * 0.42, oy - 70.5 * s * 0.8, 'center', 0.85);
      for (let i = arrows.length - 1; i >= 0; i--) {
        arrows[i].age += dt;
        const alpha = 1 - arrows[i].age / 5;
        if (alpha <= 0) {
          arrows.splice(i, 1);
          continue;
        }
        drawArrow(c, arrows[i], 1, alpha);
      }
      for (let i = live.length - 1; i >= 0; i--) {
        const d = live[i];
        d.t += dt;
        const u = easeOut(Math.min(1, d.t / d.dur));
        drawArrow(c, d, u, 1);
        drawFooty(c, d, u);
        if (d.t >= d.dur) {
          live.splice(i, 1);
          arrows.push(d);
          if (arrows.length > 10) arrows.shift();
        }
      }
    },
    spawn(t) {
      const d = make(t ? { x: t.a, y: t.b } : startPoint());
      live.push(d);
      record(d);
      emit({ rows, text: `→ ${d.kick ? 'kick' : 'handball'} · ${d.outcome} · ${rate()}` });
    },
    busy: () => live.length > 0,
    pick(sx, sy) {
      const fx = (sx - ox) / s;
      const fy = (oy - sy) / s;
      return inside(fx, fy, 0.95) ? { a: fx, b: fy } : null;
    },
    seed(n) {
      for (let i = 0; i < n; i++) record(make(startPoint()));
      return { rows, text: rate() };
    },
  };
}

export const SCENES: Record<ChartScene, (col: Palette, emit: Emit, o: SceneOptions) => Scene> = {
  pitch: pitchMap,
  wagon: wagonWheel,
  disposals: disposalHeatmap,
};
