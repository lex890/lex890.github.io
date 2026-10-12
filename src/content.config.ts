/**
 * Content collections: every JSON file in src/data/ is loaded and validated
 * here. If any data doesn't match its schema, `astro build` / `astro dev` fail
 * with an error naming the file, entry and field.
 *
 * Edit content in src/data/*.json, never in components.
 *
 * Conventions (PORTFOLIO_PLAN §4.1):
 * - Dates are "YYYY-MM" strings, or null for "Present".
 * - Optional fields are present but null (or []), so every entry has the same shape.
 * - Objects are strict: an unknown or misspelled key is an error, not silently dropped.
 *
 * Every entry also gets an `order` field (its position in the JSON file)
 * because getCollection() does not guarantee order. Sort with `byOrder`
 * from src/lib/content.ts.
 */
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// ---- Shared field types ------------------------------------------------------

/** "2026-04" */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use "YYYY-MM", e.g. "2026-04"');

/** Root-relative path to a file in public/, e.g. "/images/x.svg" */
const publicPath = z.string().startsWith('/', 'Paths must start with "/" (relative to public/)');

/** Absolute URL (https:, mailto:, …) */
const url = z.url();

const order = z.number().int();

// ---- Parsers -------------------------------------------------------------------

type Raw = Record<string, unknown>;

/** JSON array → entries with an `order` index. `idKey` names the field used as the entry id. */
const listParser = (idKey: string) => (text: string) =>
  (JSON.parse(text) as Raw[]).map((item, i) => ({ ...item, id: item[idKey], order: i }));

/** Single JSON object → one entry with the given id. */
const singleParser = (id: string) => (text: string) => [{ id, ...(JSON.parse(text) as Raw) }];

// ---- Collections -------------------------------------------------------------

const site = defineCollection({
  loader: file('src/data/site.json', { parser: singleParser('site') }),
  schema: z.strictObject({
    id: z.literal('site'),
    name: z.string().min(1),
    role: z.string().min(1),
    tagline: z.string().min(1),
    summary: z.string().min(1),
    location: z.string().min(1),
    email: z.email(),
    phone: z.string().nullable(),
    availability: z.string().min(1),
    avatar: publicPath.nullable(),
    ogImage: publicPath,
    cvPdf: publicPath.nullable(),
    socials: z.array(
      z.strictObject({
        id: z.string(),
        label: z.string(),
        url,
        icon: z.enum(['linkedin', 'github', 'mail']),
      }),
    ),
    nav: z.array(z.strictObject({ label: z.string(), href: z.string() })),
  }),
});

const experience = defineCollection({
  loader: file('src/data/experience.json', { parser: listParser('id') }),
  schema: z.strictObject({
    id: z.string(),
    order,
    role: z.string().min(1),
    company: z.string().min(1),
    companyUrl: url.nullable(),
    location: z.string(),
    start: yearMonth,
    end: yearMonth.nullable(),
    type: z.string(),
    highlights: z.array(z.string()).min(1),
    tech: z.array(z.string()),
  }),
});

const projects = defineCollection({
  // Projects are keyed by `slug` (used in /projects/[slug]).
  loader: file('src/data/projects.json', { parser: listParser('slug') }),
  schema: z.strictObject({
    id: z.string(),
    order,
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase-kebab-case'),
    title: z.string().min(1),
    client: z.string(),
    role: z.string(),
    summary: z.string().min(1),
    highlights: z.array(z.string()).min(1),
    tech: z.array(z.string()),
    category: z.string().min(1),
    image: publicPath.nullable(),
    imageAlt: z.string().min(1),
    links: z.strictObject({
      live: url.nullable(),
      repo: url.nullable(),
      caseStudy: url.nullable(),
    }),
    featured: z.boolean(),
    date: yearMonth.nullable(),
  }),
});

const skills = defineCollection({
  loader: file('src/data/skills.json', { parser: listParser('id') }),
  schema: z.strictObject({
    id: z.string(),
    order,
    label: z.string().min(1),
    items: z.array(z.string()).min(1),
  }),
});

const education = defineCollection({
  loader: file('src/data/education.json', { parser: listParser('id') }),
  schema: z.strictObject({
    id: z.string(),
    order,
    degree: z.string().min(1),
    school: z.string().min(1),
    location: z.string(),
    start: yearMonth,
    end: yearMonth.nullable(),
    notes: z.array(z.string()),
  }),
});

const certifications = defineCollection({
  loader: file('src/data/certifications.json', { parser: listParser('id') }),
  schema: z.strictObject({
    id: z.string(),
    order,
    title: z.string().min(1),
    issuer: z.string().min(1),
    date: yearMonth,
    url: url.nullable(),
  }),
});

// Interface copy: section titles, button labels, hero/player-card text.
// Everything on screen that isn't CV data still comes from src/data/.
const statKey = z.enum(['internships', 'projects', 'certifications', 'skills', 'languages']);
const labelled = z.strictObject({ label: z.string(), title: z.string() });
const sectionCopy = z.strictObject({ num: z.string().regex(/^\d{2}$/), label: z.string(), title: z.string() });
const link = z.strictObject({ label: z.string(), href: z.string() });

const ui = defineCollection({
  loader: file('src/data/ui.json', { parser: singleParser('ui') }),
  schema: z.strictObject({
    id: z.literal('ui'),
    header: z.strictObject({ cvLabel: z.string(), menuLabel: z.string() }),
    hero: z.strictObject({
      badge: z.string(),
      photoAlt: z.string().min(1),
      classCard: labelled.extend({ text: z.string() }),
      stats: z.array(z.strictObject({ stat: statKey, label: z.string(), sub: z.string() })).length(4),
      primaryCta: link,
      secondaryCta: link,
    }),
    sections: z.strictObject({
      about: sectionCopy,
      experience: sectionCopy,
      projects: sectionCopy,
      skills: sectionCopy,
      credentials: sectionCopy,
    }),
    player: z.strictObject({
      section: z.string(),
      class: z.string(),
      level: z.strictObject({ label: z.string(), value: z.number().int(), max: z.number().int().positive() }),
      tabs: z.strictObject({ stats: z.string(), ability: z.string() }),
      // Each row shows either a computed count (`stat`) or fixed text (`value`).
      stats: z.array(
        z
          .strictObject({ label: z.string(), stat: statKey.nullable(), value: z.string().nullable() })
          .refine((r) => (r.stat === null) !== (r.value === null), 'Set exactly one of "stat" or "value"'),
      ),
      abilities: z.array(z.strictObject({ label: z.string(), detail: z.string() })),
      loadoutLabel: z.string(),
    }),
    about: z.strictObject({
      summaryLabel: z.string(),
      base: labelled,
      academy: labelled.extend({ text: z.string() }),
      status: labelled,
    }),
    projects: z.strictObject({ allLabel: z.string(), selectLabel: z.string() }),
    credentials: z.strictObject({
      educationLabel: z.string(),
      progressLabel: z.string(),
      watermark: z.string(),
      certificationsTitle: z.string(),
    }),
    contact: z.strictObject({ label: z.string(), title: z.string(), text: z.string() }),
    projectsPage: z.strictObject({
      title: z.string(),
      label: z.string(),
      description: z.string(),
      filterLabel: z.string(),
      allLabel: z.string(),
      /** "{shown}" and "{total}" are replaced with numbers. */
      countText: z.string(),
    }),
    projectDetail: z.strictObject({
      highlightsTitle: z.string(),
      techTitle: z.string(),
      linksTitle: z.string(),
      links: z.strictObject({ live: z.string(), repo: z.string(), caseStudy: z.string() }),
      prevLabel: z.string(),
      nextLabel: z.string(),
      backLabel: z.string(),
    }),
    cv: z.strictObject({
      title: z.string(),
      description: z.string(),
      printLabel: z.string(),
      backLabel: z.string(),
      headings: z.strictObject({
        summary: z.string(),
        experience: z.string(),
        projects: z.string(),
        skills: z.string(),
        education: z.string(),
        certifications: z.string(),
      }),
    }),
    notFound: z.strictObject({ title: z.string(), text: z.string(), homeLabel: z.string() }),
    footer: z.strictObject({ note: z.string() }),
  }),
});

export const collections = { site, ui, experience, projects, skills, education, certifications };
