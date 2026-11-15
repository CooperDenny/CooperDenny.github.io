/** "Jul 2023 – Oct 2023" — the one place date ranges are formatted. */
export const dateRange = (start: string, end: string) => `${start} – ${end}`;

/** ["a", "b", "c"] → "a, b, and c" (English list with Oxford comma). */
export const listSentence = (items: string[]) =>
  new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(items);

/** Join truthy class names. */
export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(' ');
