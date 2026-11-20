'use client';

import Icon from '@/components/ui/Icon';

/** Opens the browser's print dialog, where the CV can be saved as PDF. */
export default function PrintButton() {
  return (
    <button type="button" className="btn btn--primary" onClick={() => window.print()}>
      <Icon name="download" /> Save as PDF
    </button>
  );
}
