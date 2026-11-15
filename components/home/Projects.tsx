import FeaturedProjectCard from '@/components/home/FeaturedProjectCard';
import ProjectCard from '@/components/home/ProjectCard';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/content/sections';
import type { FeaturedProject, Project } from '@/content/types';

type Props = { featured: FeaturedProject; projects: Project[] };

export default function Projects({ featured, projects }: Props) {
  return (
    <Section section={SECTIONS.projects} tone="alt">
      {/* The Brownlow model is one consolidated card covering both seasons — keep it that way. */}
      <FeaturedProjectCard project={featured} />
      <ul className="project-grid">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </ul>
    </Section>
  );
}
