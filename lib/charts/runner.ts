// Drives one chart scene on one canvas: sizing (DPR capped at 2), the animation loop, the opening
// burst, clicks, pausing off-screen and in background tabs, and reduced motion (a still, filled frame).

import type { ChartScene } from '@/content/types';
import { readPalette } from '@/lib/charts/draw';
import { SCENES, type ChartEvent, type Scene, type Target } from '@/lib/charts/scenes';
import { prefersReducedMotion } from '@/lib/motion/reducedMotion';

export type ChartRunner = {
  setScene(name: ChartScene): void;
  pause(paused: boolean): void;
  destroy(): void;
};

type Options = {
  onEvent: (e: ChartEvent) => void;
  /** Events drawn instantly under reduced motion. */
  seed?: number;
};

export function runChart(canvas: HTMLCanvasElement, name: ChartScene, opts: Options): ChartRunner {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const col = readPalette(canvas);
  let scene: Scene;
  let W = 1;
  let H = 1;
  let dpr = 1;
  let running = false;
  let visible = true;
  let held = false;
  let raf = 0;
  let last = 0;
  let next = 0;
  let spawned = 0;
  const queue: Target[] = [];

  function layout() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    scene?.layout(W, H, dpr);
  }
  function frame(dt: number) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    scene?.draw(ctx, dt);
  }
  function tick(now: number) {
    raf = 0;
    if (!running || !visible || held) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    next -= dt;
    if (next <= 0) {
      scene.spawn(queue.shift());
      spawned++;
      next = spawned < scene.burst ? 0.32 : scene.interval + Math.random() * 0.3;
    }
    frame(dt);
    raf = requestAnimationFrame(tick);
  }
  function wake() {
    if (running && visible && !held && !raf) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  }
  function setScene(n: ChartScene) {
    scene = SCENES[n](col, opts.onEvent, {});
    spawned = 0;
    queue.length = 0;
    layout();
    if (prefersReducedMotion()) {
      const e = scene.seed(opts.seed ?? 140);
      frame(0);
      opts.onEvent(e);
      running = false;
    } else {
      next = 0.4;
      running = true;
      wake();
    }
  }

  const resize = new ResizeObserver(() => {
    layout();
    frame(0);
  });
  resize.observe(canvas);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    wake();
  });
  io.observe(canvas);
  const onVisibility = () => {
    visible = !document.hidden;
    wake();
  };
  document.addEventListener('visibilitychange', onVisibility);
  const onPointer = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const t = scene.pick(e.clientX - r.left, e.clientY - r.top);
    if (!t) return;
    if (prefersReducedMotion()) {
      // Play the event straight to its end state.
      scene.spawn(t);
      for (let i = 0; i < 40; i++) frame(0.05);
      return;
    }
    queue.push(t);
    next = Math.min(next, 0.02);
    running = true;
    wake();
  };
  canvas.addEventListener('pointerdown', onPointer);

  setScene(name);

  return {
    setScene,
    pause(p) {
      held = p;
      wake();
    },
    destroy() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointer);
    },
  };
}
