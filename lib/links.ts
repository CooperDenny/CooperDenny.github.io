/** A link is external if it leaves the site over http(s). mailto: and relative links are not. */
export const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Attributes for opening external links safely in a new tab; empty for internal links. */
export const externalAttrs = (href: string) =>
  isExternal(href) ? ({ target: '_blank', rel: 'noopener noreferrer' } as const) : {};

/** "0478 944 105" → "tel:+61478944105": an Australian local number as a dialable international link. */
export const telHref = (local: string) => `tel:${local.replace(/\s+/g, '').replace(/^0/, '+61')}`;

/** "https://www.linkedin.com/in/cooper-denny/" → "linkedin.com/in/cooper-denny" (for print). */
export const prettyUrl = (href: string) =>
  href.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
