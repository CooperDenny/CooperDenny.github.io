import Icon from '@/components/ui/Icon';
import SmartLink from '@/components/ui/SmartLink';
import type { Project } from '@/content/types';
import { isExternal } from '@/lib/links';

/** Side-project card. The title link is stretched over the whole card (see .project__link::after). */
export default function ProjectCard({ project }: { project: Project }) {
  const [link] = project.links;
  return (
    <li className="project card">
      <h3>
        <SmartLink href={link.href} className="project__link">
          {project.title}
        </SmartLink>
      </h3>
      <p className="project__summary">{project.oneLiner}</p>
      <div className="project__foot">
        <span className="project__stack">{project.stack.join(' · ')}</span>
        <span className="project__cta" aria-hidden="true">
          <Icon name={isExternal(link.href) ? 'external' : 'arrowRight'} />
        </span>
      </div>
    </li>
  );
}
