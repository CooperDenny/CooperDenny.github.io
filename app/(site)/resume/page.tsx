import type { Metadata } from 'next';
import {
  ResumeEducation,
  ResumeExperience,
  ResumeHeader,
  ResumeProjects,
  ResumeSkills,
  ResumeSummary,
  ResumeToolbar,
} from '@/components/resume/ResumeSections';
import { siteConfig } from '@/config/site';
import { education, experience, featuredProject, profile, projects, skills } from '@/content/profile';
import { RESUME_HREF } from '@/content/sections';
import { resumeProjects, resumeSkills } from '@/content/selectors';

export const metadata: Metadata = {
  title: `Résumé — ${profile.name}, ${profile.role}`,
  description: `Résumé for ${profile.name}, ${profile.role} at ${profile.employer} in ${profile.location}.`,
  alternates: { canonical: RESUME_HREF },
};

// A print-optimised, single-column résumé rendered from the same content as the home page.
// "Save as PDF" uses the browser's print dialog; @media print in globals.css hides site chrome.
export default function ResumePage() {
  return (
    <div className="resume-page">
      <ResumeToolbar />
      <article className="resume">
        <ResumeHeader profile={profile} siteUrl={siteConfig.url} />
        <ResumeSummary text={profile.resumeSummary} />
        <ResumeExperience jobs={experience} />
        <ResumeProjects entries={resumeProjects(featuredProject, projects)} />
        <ResumeEducation education={education} />
        <ResumeSkills groups={resumeSkills(skills)} />
      </article>
    </div>
  );
}
