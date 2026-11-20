/** True when the visitor asks for reduced motion: animations then land on their final frame. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
