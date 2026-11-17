import SmartLink from '@/components/ui/SmartLink';
import type { ProjectList } from '@/content/types';

/** Compact list of secondary projects under the card grid: a title link and one line each. */
export default function ProjectLinkList({ list }: { list: ProjectList }) {
  return (
    <div className="more-projects">
      <h3 className="more-projects__title">{list.title}</h3>
      <ul className="more-projects__list">
        {list.projects.map((p) => (
          <li key={p.slug}>
            <SmartLink href={p.links[0].href} className="more-projects__link">
              {p.title}
            </SmartLink>
            <span className="more-projects__desc">{p.oneLiner}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
