import Icon from '@/components/ui/Icon';
import SmartLink from '@/components/ui/SmartLink';
import Tools from '@/components/ui/Tools';
import type { Project } from '@/content/types';
import { isExternal } from '@/lib/links';

/** A project as one ruled row. The title link is stretched over the whole row (see .project__link::after). */
export default function ProjectRow({ project }: { project: Project }) {
  const [link] = project.links;
  return (
    <li className="ledger__row project">
      <h3 className="project__title">
        <SmartLink href={link.href} className="project__link">
          {project.title}
          <Icon name={isExternal(link.href) ? 'external' : 'arrowRight'} />
        </SmartLink>
      </h3>
      <div className="ledger__body">
        <p className="project__summary">{project.oneLiner}</p>
        <Tools items={project.stack} />
      </div>
    </li>
  );
}
