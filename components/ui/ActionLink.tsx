import type { ReactNode } from 'react';
import Icon, { type IconName } from '@/components/ui/Icon';
import SmartLink from '@/components/ui/SmartLink';
import { cx } from '@/lib/format';

type Props = {
  href: string;
  variant: 'primary' | 'ghost';
  size?: 'small';
  icon?: IconName;
  /** Put the icon after the label (e.g. a trailing arrow). */
  iconEnd?: boolean;
  /** Icon-only button: requires an accessible label. */
  ariaLabel?: string;
  className?: string;
  tabIndex?: number;
  children?: ReactNode;
};

/** A link styled as a button — every CTA on the site goes through this. */
export default function ActionLink({ href, variant, size, icon, iconEnd, ariaLabel, className, tabIndex, children }: Props) {
  const iconOnly = !children;
  const glyph = icon && <Icon name={icon} />;
  return (
    <SmartLink
      href={href}
      className={cx('btn', `btn--${variant}`, size && `btn--${size}`, iconOnly && 'btn--icon', className)}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
    >
      {iconOnly ? glyph : iconEnd ? <>{children} {glyph}</> : <>{glyph} {children}</>}
    </SmartLink>
  );
}
