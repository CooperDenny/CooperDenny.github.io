// Canvas helpers shared by the chart scenes. Colours come from the design tokens at runtime,
// so the charts follow public/tokens.css like everything else.

export const TAU = Math.PI * 2;

export type RGB = [number, number, number];

/** The token colours a scene draws with, read once from the canvas's computed style. */
export type Palette = {
  accent: RGB;
  ball: RGB;
  shine: RGB;
  shade: RGB;
  turf: string;
  turfStripe: string;
  onTurf: RGB;
  pitch: string;
  pitchStripe: string;
  ink: RGB;
  mono: string;
};

function cssVar(el: Element, name: string, fallback: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

function rgb(color: string): RGB {
  const hex = /^#([0-9a-f]{6})$/i.exec(color);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const fn = /rgba?\(([^)]+)\)/.exec(color);
  if (fn) {
    const [r, g, b] = fn[1].split(',').map(parseFloat);
    return [r, g, b];
  }
  return [0, 0, 0];
}

export function readPalette(el: Element): Palette {
  return {
    accent: rgb(cssVar(el, '--accent', '#16305c')),
    ball: rgb(cssVar(el, '--ball', '#b3122b')),
    shine: rgb(cssVar(el, '--ball-shine', '#e0566a')),
    shade: rgb(cssVar(el, '--ball-shade', '#5e0914')),
    turf: cssVar(el, '--turf', '#3b7438'),
    turfStripe: cssVar(el, '--turf-stripe', '#427d3e'),
    onTurf: rgb(cssVar(el, '--on-turf', '#ffffff')),
    pitch: cssVar(el, '--pitch', '#d6c18d'),
    pitchStripe: cssVar(el, '--pitch-stripe', '#ccb57f'),
    ink: rgb(cssVar(el, '--text', '#0f1f17')),
    mono: cssVar(el, '--font-mono', 'monospace'),
  };
}

export const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
export const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
export const easeOut = (u: number) => 1 - Math.pow(1 - u, 3);

/** A standard-normal random number (Box–Muller). */
export function gauss(): number {
  let u = 0;
  let v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

/** Picks one value from [weight, value] pairs whose weights sum to 1. */
export function pickWeighted<T>(items: [number, T][]): T {
  const r = Math.random();
  let acc = 0;
  for (const [w, value] of items) {
    acc += w;
    if (r <= acc) return value;
  }
  return items[items.length - 1][1];
}

/** The leather ball: a shaded red disc with a dotted seam once it's big enough to see one. */
export function drawBall(c: CanvasRenderingContext2D, col: Palette, x: number, y: number, r: number, glow: boolean) {
  const g = c.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, rgba(col.shine, 1));
  g.addColorStop(0.5, rgba(col.ball, 1));
  g.addColorStop(1, rgba(col.shade, 1));
  c.save();
  if (glow) {
    c.shadowColor = 'rgba(0,0,0,.35)';
    c.shadowBlur = r * 1.6;
    c.shadowOffsetY = r * 0.4;
  }
  c.fillStyle = g;
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fill();
  c.restore();
  if (r > 4) {
    c.save();
    c.strokeStyle = rgba(col.onTurf, 0.8);
    c.lineWidth = 1;
    c.setLineDash([1.5, 1.5]);
    c.beginPath();
    c.arc(x - r * 1.6, y, r * 1.75, -0.5, 0.5);
    c.stroke();
    c.restore();
  }
}

/** A small mono chart label in on-turf white. */
export function label(
  c: CanvasRenderingContext2D,
  col: Palette,
  text: string,
  x: number,
  y: number,
  align: CanvasTextAlign = 'left',
  alpha = 0.92,
) {
  c.save();
  c.font = `600 10px ${col.mono}`;
  c.textAlign = align;
  c.textBaseline = 'middle';
  c.fillStyle = rgba(col.onTurf, alpha);
  c.fillText(text, x, y);
  c.restore();
}

/** A line that reads on grass: a soft dark under-stroke, then the colour. */
export function fieldLine(
  c: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  w: number,
  dash: number[] = [],
) {
  c.save();
  c.lineCap = 'round';
  c.setLineDash(dash);
  c.strokeStyle = 'rgba(0,0,0,.18)';
  c.lineWidth = w + 2;
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
  c.strokeStyle = color;
  c.lineWidth = w;
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
  c.restore();
}
