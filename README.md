# leks-portfolio

Personal portfolio and printable CV for **John Lexter, Software Developer**.
Live at **https://leks-portfolio.dev**.

Built with Astro 7 (static output), React islands, shadcn/ui and SCSS. All
text lives in JSON files, so changing content never means touching components.

## Run it

Requires Node **22.12+** (see `.node-version`).

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static site → dist/
npm run preview    # serve dist/ locally
npm run check      # type-check .astro / .ts files
```

## Pages

| URL | What it is |
|---|---|
| `/` | Home: hero, about (player card), experience, projects, skills, credentials, contact |
| `/projects` | All projects, filterable by category |
| `/projects/<slug>` | One page per project (generated from `projects.json`) |
| `/cv` | Plain CV built from the same data; "Print / Save as PDF" gives a clean A4 copy |
| `/404` | Not-found page |

`/sitemap-index.xml` and `/robots.txt` are generated at build time.

## Edit content

Everything you can read on the site comes from `src/data/`:

| File | Holds |
|---|---|
| `site.json` | Name, role, tagline, summary, location, email, socials, nav links, image paths |
| `experience.json` | Jobs (newest first) |
| `projects.json` | Projects: card text, highlights, tech, category, image, links |
| `skills.json` | Skill groups and their items |
| `education.json` | Degrees |
| `certifications.json` | Certifications |
| `ui.json` | Interface copy: section titles, button labels, hero/player-card text, CV and 404 wording |

Rules (checked on every build):

- Dates are `"YYYY-MM"`; use `null` for "Present".
- Optional fields stay in the file as `null` (or `[]`) rather than being deleted.
- Unknown or misspelled keys are errors.

If something doesn't match, `npm run dev` / `npm run build` stops and names the
file, entry and field. The schemas are in `src/content.config.ts`.

Numbers on the site (internships, projects, certifications, skills, languages)
are **counted from the data**, never typed in. Add a skill and the counters
update.

Things that hide themselves until they're real:

- Social links whose URL still contains `REPLACE_ME` (LinkedIn, GitHub).
- Project links (`live`, `repo`, `caseStudy`) that are `null`; the Links card
  disappears entirely when all three are.

### Add a project

Append an object to `src/data/projects.json` (copy an existing one). The
`slug` becomes the URL (`/projects/<slug>`) and must be lowercase-kebab-case.
The home page shows projects with `"featured": true`; `/projects` shows all.
New categories appear in the filter automatically.

## Swap images

Images are plain files in `public/`; data files point at them by path.

| Image | Replace | Notes |
|---|---|---|
| Profile photo | `public/images/profile/placeholder-avatar.svg`, or set `avatar` in `site.json` | Use a **transparent cut-out PNG/WebP** (about 340×480) so it sits over the yellow shape |
| Project screenshots | Set each project's `image` in `projects.json` (and update `imageAlt`) | 16:9; shown in a slanted frame. `null` falls back to the placeholder |
| Social preview | `public/images/og/placeholder-og.png`, or set `ogImage` in `site.json` | 1200×630 PNG/JPG |
| CV PDF | `public/cv/john-lexter-cv.pdf` | Linked by the header's "Download CV". Set `cvPdf` to `null` to link to `/cv` instead |
| Favicon | `public/favicon.svg` | |

## Styling

Design tokens, mixins and the holo hover effects are documented in
[`src/styles/README.md`](src/styles/README.md). In short: our components use
SCSS modules; Tailwind exists only for the shadcn components in
`src/components/ui/`; colors live only in `src/styles/_tokens.scss`.

## Project layout

```
src/
├── data/            all content (JSON)
├── content.config.ts  schemas for the data
├── components/
│   ├── ui/          shadcn (generated; restyle via src/styles/_shadcn.scss)
│   ├── game/        small building blocks: pills, tags, frames, CountUp…
│   ├── cards/       PlayerCard, ProjectCard, ExperienceItem, SkillGroup, ProjectFilter
│   ├── sections/    home-page sections
│   └── layout/      Header, MobileNav, Footer, Seo, PrintButton
├── layouts/         BaseLayout (site), PrintLayout (/cv)
├── pages/           routes
├── lib/             data accessors and formatting helpers
└── styles/          tokens, mixins, effects, print rules, page styles
```

## Deploy

The build is a fully static `dist/` folder, so any static host works. The
domain is set once in `astro.config.mjs` (`site`); canonical links, Open
Graph URLs, the sitemap and `robots.txt` all follow it.

`public/_headers` (long-term caching for hashed assets plus basic security
headers) is read by both hosts below. Both serve `dist/404.html` for unknown
URLs automatically.

### Cloudflare Pages

1. Push the repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**,
   pick the repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version comes from `.node-version` (22).
4. Deploy. Every push to `main` redeploys; other branches get preview URLs.
5. **Custom domains → Set up a domain →** `leks-portfolio.dev`. If the domain's
   DNS is on Cloudflare the records are added for you; otherwise add the CNAME
   it shows at your registrar.

### Netlify

1. **Add new site → Import an existing project**, pick the repo.
2. Build command `npm run build`, publish directory `dist` (Netlify detects
   Astro and fills these in). Node version comes from `.node-version`.
3. Deploy, then **Domain management → Add a domain →** `leks-portfolio.dev` and
   follow the DNS instructions.

`.dev` domains are HTTPS-only (HSTS preloaded). Both hosts issue the
certificate automatically; the site won't load over plain HTTP, and that's
expected.

### Changing the domain

Edit `site` in `astro.config.mjs`, rebuild, redeploy.

## Before launch

- [x] Real LinkedIn profile URL and GitHub username in `site.json` (replace `REPLACE_ME`)
- [x] Profile photo (cut-out PNG/WebP)
- [x] Project screenshots, plus repo / live demo links where public
- [x] Final CV PDF at `public/cv/john-lexter-cv.pdf`
- [ ] Social preview image (optional; the placeholder is on-brand)
- [x] Project dates, if you want them shown (`date` in `projects.json`)
- [x] Decide whether to show a phone number (`phone` in `site.json`)
- [ ] Point `leks-portfolio.dev` at the host
