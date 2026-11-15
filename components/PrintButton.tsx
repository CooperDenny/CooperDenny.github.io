'use client';

export default function PrintButton() {
  return (
    <button type="button" className="btn btn--primary" onClick={() => window.print()}>
      <i className="fas fa-download" aria-hidden="true"></i> Save as PDF
    </button>
  );
}
