import Contact from '@/components/home/Contact';
import Education from '@/components/home/Education';
import Experience from '@/components/home/Experience';
import Hero from '@/components/home/Hero';
import Projects from '@/components/home/Projects';
import Skills from '@/components/home/Skills';
import {
  earlierProjects,
  education,
  experience,
  featuredProject,
  profile,
  projects,
  skills,
} from '@/content/profile';

// Composition root: the only place home-page data meets components. Components import
// types, not content, so each can be rendered with any data (dependency inversion).
export default function Home() {
  return (
    <>
      <Hero profile={profile} />
      <Experience jobs={experience} />
      <Projects featured={featuredProject} projects={projects} earlier={earlierProjects} />
      <Skills groups={skills} />
      <Education education={education} />
      <Contact contact={profile.contact} />
    </>
  );
}
