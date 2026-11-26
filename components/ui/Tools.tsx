import { TOOLS_LABEL } from '@/content/sections';
import { commaList } from '@/lib/format';

/** The plain tools line under a job or project: a label, then the tools as one comma-separated line. */
export default function Tools({ items }: { items: string[] }) {
  return (
    <p className="tools">
      <span className="tools__label">{TOOLS_LABEL}</span> {commaList(items)}
    </p>
  );
}
