/**
 * Typed accessors for the content collections (see src/content.config.ts).
 * Each returns entries in the order they appear in their JSON file, and
 * unwraps `.data` so components get plain objects.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

type ListCollection = 'experience' | 'projects' | 'skills' | 'education' | 'certifications';

export type Site = CollectionEntry<'site'>['data'];
export type Ui = CollectionEntry<'ui'>['data'];
export type Experience = CollectionEntry<'experience'>['data'];
export type Project = CollectionEntry<'projects'>['data'];
export type SkillGroup = CollectionEntry<'skills'>['data'];
export type Education = CollectionEntry<'education'>['data'];
export type Certification = CollectionEntry<'certifications'>['data'];

/** Entries of a list collection, in JSON file order. */
async function list<C extends ListCollection>(name: C): Promise<CollectionEntry<C>['data'][]> {
  const entries = await getCollection(name);
  return entries.map((e) => e.data).sort((a, b) => a.order - b.order);
}

export async function getSite(): Promise<Site> {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('src/data/site.json is missing');
  return entry.data;
}

export async function getUi(): Promise<Ui> {
  const entry = await getEntry('ui', 'ui');
  if (!entry) throw new Error('src/data/ui.json is missing');
  return entry.data;
}

export const getExperience = () => list('experience');
export const getProjects = () => list('projects');
export const getSkills = () => list('skills');
export const getEducation = () => list('education');
export const getCertifications = () => list('certifications');

export type Stats = Awaited<ReturnType<typeof getStats>>;
export type StatKey = keyof Stats;

/** Counts shown in the hero StatPills and the PlayerCard (computed, never typed in). */
export async function getStats() {
  const [experience, projects, skills, certifications] = await Promise.all([
    getExperience(),
    getProjects(),
    getSkills(),
    getCertifications(),
  ]);
  return {
    internships: experience.filter((e) => e.type === 'Internship').length,
    projects: projects.length,
    certifications: certifications.length,
    skills: skills.reduce((sum, group) => sum + group.items.length, 0),
    languages: skills.find((g) => g.id === 'languages')?.items.length ?? 0,
  };
}
