import { useId } from 'react';

/**
 * A leather cricket ball: a shaded red sphere with a curved, stitched seam. Decorative
 * (`aria-hidden`). Colours come from the `--ball-*` tokens; red is only ever the ball (D26).
 */
export default function CricketBall({ className }: { className?: string }) {
  const id = useId();
  const shade = `${id}-shade`;
  const clip = `${id}-clip`;
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={shade} cx="35%" cy="30%" r="75%">
          <stop offset="0" style={{ stopColor: 'var(--ball-shine)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--ball)' }} />
          <stop offset="1" style={{ stopColor: 'var(--ball-shade)' }} />
        </radialGradient>
        <clipPath id={clip}>
          <circle cx="12" cy="12" r="11" />
        </clipPath>
      </defs>
      <circle cx="12" cy="12" r="11" fill={`url(#${shade})`} />
      <g clipPath={`url(#${clip})`} fill="none" style={{ stroke: 'var(--ball-seam)' }} strokeLinecap="round">
        <path d="M8.6 0.5 Q15.2 12 8.6 23.5" strokeWidth="0.9" strokeOpacity="0.7" />
        <path d="M6.9 1.4 Q13.3 12 6.9 22.6" strokeWidth="1.3" strokeDasharray="0.1 2.1" />
        <path d="M10.4 0.2 Q17.1 12 10.4 23.8" strokeWidth="1.3" strokeDasharray="0.1 2.1" />
      </g>
    </svg>
  );
}
