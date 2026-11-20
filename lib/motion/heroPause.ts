// One pause switch for the whole hero (WCAG 2.2.2): the masthead's pause button sets it, and the
// photo crossfade and the chart console both follow it. A tiny external store for useSyncExternalStore.

let paused = false;
const listeners = new Set<() => void>();

export const heroPause = {
  get: () => paused,
  /** Always false on the server: the hero renders playing. */
  getServer: () => false,
  set(p: boolean) {
    if (p === paused) return;
    paused = p;
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
