'use client';

import Icon from '@/components/ui/Icon';

export default function PrintButton() {
  return (
    <button type="button" className="btn btn--primary" onClick={() => window.print()}>
      <Icon name="download" /> Save as PDF
    </button>
  );
}
