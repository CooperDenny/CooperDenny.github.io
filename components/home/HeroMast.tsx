'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Icon from '@/components/ui/Icon';
import { trackOverlay } from '@/content/selectors';
import type { HeroShot } from '@/content/types';
import { prefersReducedMotion } from '@/lib/motion/reducedMotion';

/** How long each photo holds before the crossfade. */
const HOLD_MS = 7000;

/**
 * The hero masthead: Cooper's match photos crossfading behind his name, each with a tracking
 * overlay (brackets and a tag on Cooper only, plus a ball reticle). The photos are content;
 * the overlay and drift are decoration.
 *
 * Without JavaScript the first photo shows, fully tagged, and nothing moves. With it, the mast
 * "arms": photos crossfade every 7s and drift slowly (transform only). The pause button stops
 * all of it (WCAG 2.2.2). Reduced motion: still, first photo, no button.
 */
export default function HeroMast({ shots, children }: { shots: HeroShot[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [current, setCurrent] = useState(0);
  const visible = usePageVisible(ref);
  const [paused, setPaused] = useState(false);
  const running = armed && visible && !paused;

  useEffect(() => {
    if (!prefersReducedMotion()) setArmed(true);
  }, []);

  // Keep the tracking tags a constant on-screen size, whatever the crop (the SVG uses `slice`, like `object-fit: cover`).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      const scale = Math.max(r.width / 2000, r.height / 1333) || 1;
      el.style.setProperty('--tag-k', (11.5 / (13 * scale)).toFixed(3));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!running || shots.length < 2) return;
    const t = window.setTimeout(() => setCurrent((i) => (i + 1) % shots.length), HOLD_MS);
    return () => window.clearTimeout(t);
  }, [running, current, shots.length]);

  const classes = ['mast', armed && 'is-armed', paused && 'is-paused'].filter(Boolean).join(' ');

  return (
    <div className={classes} ref={ref}>
      <div className="mast__reel">
        {shots.map((shot, i) => (
          <Shot key={shot.src} shot={shot} on={i === current} first={i === 0} />
        ))}
      </div>
      <button
        type="button"
        className="mast__pause"
        aria-pressed={paused}
        aria-label={paused ? 'Play hero animation' : 'Pause hero animation'}
        hidden={!armed}
        onClick={() => setPaused((p) => !p)}
      >
        <Icon name={paused ? 'play' : 'pause'} />
      </button>
      <div className="mast__inner">{children}</div>
    </div>
  );
}

function Shot({ shot, on, first }: { shot: HeroShot; on: boolean; first: boolean }) {
  const t = trackOverlay(shot);
  return (
    <figure className={`shot${shot.push ? ' shot--push' : ''}${on ? ' is-on' : ''}`}>
      <div className="shot__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="shot__img"
          src={shot.src}
          srcSet={`${shot.srcSmall} 1000w, ${shot.src} 2000w`}
          sizes="100vw"
          width={shot.width}
          height={shot.height}
          alt={shot.alt}
        aria-hidden={!on}
          loading={first ? 'eager' : 'lazy'}
          decoding={first ? 'sync' : 'async'}
        />
        <svg
          className="shot__track"
          viewBox={`0 0 ${shot.width} ${shot.height}`}
          preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
          <g style={{ '--i': 0 } as React.CSSProperties}>
            <rect className="track__outline track__fade" x={t.box.x} y={t.box.y} width={t.box.w} height={t.box.h} />
            <path className="track__box" pathLength={1} d={t.brackets} />
            <g transform={`translate(${t.box.x} ${t.box.y})`}>
              <g className="track__mark track__fade">
                <g className="track__tag track__tag--me" transform="translate(0 -26)">
                  <rect width={t.tag.width} height={22} rx={3} />
                  <text x={9} y={15.5}>
                    {t.tag.text}
                  </text>
                </g>
              </g>
            </g>
          </g>
          <g style={{ '--i': 1 } as React.CSSProperties} transform={`translate(${t.ball.x} ${t.ball.y})`}>
            <g className="track__mark track__fade">
              <circle className="track__spin" r={17} />
              <circle className="track__ring" r={10} />
              <circle className="track__core" r={2.5} />
              <g className="track__tag" transform={`translate(${-(t.ball.tag.width + 24)} -11)`}>
                <rect width={t.ball.tag.width} height={22} rx={3} />
                <text x={9} y={15.5}>
                  {t.ball.tag.text}
                </text>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </figure>
  );
}

/** False while the element is off-screen or the tab is in the background. */
function usePageVisible(ref: React.RefObject<HTMLElement>) {
  const [onScreen, setOnScreen] = useState(true);
  const [tabShown, setTabShown] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    const onVis = () => setTabShown(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [ref]);
  return onScreen && tabShown;
}
