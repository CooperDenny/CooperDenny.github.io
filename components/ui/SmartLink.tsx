import type { AnchorHTMLAttributes } from 'react';
import { externalAttrs } from '@/lib/links';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** An <a> that opens external URLs in a new tab (safely) and leaves internal ones alone. */
export default function SmartLink({ href, children, ...rest }: Props) {
  return (
    <a href={href} {...externalAttrs(href)} {...rest}>
      {children}
    </a>
  );
}
