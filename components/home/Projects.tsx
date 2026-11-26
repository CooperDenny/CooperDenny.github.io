import FeaturedProjectCard from '@/components/home/FeaturedProjectCard';
import ProjectLinkList from '@/components/home/ProjectLinkList';
import ProjectRow from '@/components/home/ProjectRow';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/content/sections';
import type { FeaturedProject, Project, ProjectList } from '@/content/types';

type Props = { featured: FeaturedProject; projects: Project[]; earlier: ProjectList };

/** Projects section: the featured project, one ruled row per project, then a compact list of earlier work. */
export default function Projects({ featured, projects, earlier }: Props) {
  return (
    <Section section={SECTIONS.projects}>
      {/* The Brownlow model is one consolidated entry covering every season — keep it that way. */}
      <FeaturedProjectCard project={featured} />
      <ul className="ledger">
        {projects.map((p) => (
          <ProjectRow key={p.slug} project={p} />
        ))}
      </ul>
      <ProjectLinkList list={earlier} />
    </Section>
  );
}
