import FeaturedProjectCard from '@/components/home/FeaturedProjectCard';
import ProjectCard from '@/components/home/ProjectCard';
import ProjectLinkList from '@/components/home/ProjectLinkList';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/content/sections';
import type { FeaturedProject, Project, ProjectList } from '@/content/types';

type Props = { featured: FeaturedProject; projects: Project[]; earlier: ProjectList };

/** Projects section: the featured card, the grid of project cards, then a compact list of earlier work. */
export default function Projects({ featured, projects, earlier }: Props) {
  return (
    <Section section={SECTIONS.projects} tone="alt">
      {/* The Brownlow model is one consolidated card covering both seasons — keep it that way. */}
      <FeaturedProjectCard project={featured} />
      <ul className="project-grid">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </ul>
      <ProjectLinkList list={earlier} />
    </Section>
  );
}
