/** "Jul 2023 – Oct 2023" — the one place date ranges are formatted. */
export const dateRange = (start: string, end: string) => `${start} – ${end}`;

/** ["a", "b", "c"] → "a, b, and c" (English list with Oxford comma). */
export const listSentence = (items: string[]) =>
  new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(items);

/** ["R", "SQL"] → "R, SQL": the plain tools line under jobs, projects and skill groups. */
export const commaList = (items: string[]) => items.join(', ');

/** Join truthy class names. */
export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(' ');
