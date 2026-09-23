# Thread Academy

A free, W3Schools-style interactive learning library for school students — built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS + MDX**, exported as a fully static site (no backend, no database, no auth, no tracking).

Twelve subjects (Mathematics, Physics, Chemistry, Biology, Computer Science, English, History, Geography, Economics, Business, Spanish, French) across four curricula — British, Cambridge, American and IB — each keeping its own level structure.

## Prerequisites

- **Node.js 18+** (20+ recommended)
- npm (bundled with Node)

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server at http://localhost:3000
```

## Building

```bash
npm run build   # → static site in out/
```

`npm run build` runs two steps automatically:

1. `prebuild` — `tsx scripts/build-search-index.ts` scans `content/**/*.mdx` plus the data model and writes `public/search-index.json` (the client-side search index).
2. `next build` — prerenders every route to `out/` (`output: 'export'` in `next.config.mjs`).

Preview the export locally:

```bash
npx serve out        # or: python3 -m http.server --directory out
```

## Project structure

```
src/
  app/                    # routes (all statically generated)
    page.tsx              # home: hero, subjects, curricula, how-it-works
    subjects/…            # /subjects, /subjects/[subject], …/[curriculum]/[level]/[chapter]/[topic]
    curriculum/…          # /curriculum, /curriculum/[curriculum]/[level]
    resources/…           # /resources hub + /resources/[subject]/[curriculum]/[level]/[chapter]
    about/page.tsx
    search/page.tsx       # client-side search over public/search-index.json
  components/
    SiteHeader.tsx / SiteFooter.tsx / HeroSearch.tsx / PageHero.tsx
    textbook/             # MDX vocabulary: Callout, Definition, Formula, Diagram,
                          #   CodeBlock, PracticeQuestions, Quiz, LearningObjectives,
                          #   RelatedTopics, NextChapter, Breadcrumbs, ChapterSidebar…
    widgets/              # TryItPython (lazy Pyodide), EquationSolver
  lib/
    types.ts              # shared TypeScript types
    curriculum.ts         # curricula, each with its OWN stage/year structure
    subjects.ts           # subjects, categories, chapter outlines
    chapters.ts           # topics per chapter
    content.ts            # MDX loading via fs (build-time)
    resources.ts          # chapter resources (notes, worksheets, videos, tools, revision)
    search.ts             # buildSearchIndex()
  mdx-components.tsx      # component map passed to MDXRemote
content/
  <curriculum>/<level>/<subject>/<chapter>/<topic>.mdx   # lesson content
scripts/
  build-search-index.ts   # writes public/search-index.json (runs on prebuild)
```

## Adding content

A new lesson = **one MDX file + one data entry**. Nothing else to rewrite.

1. Create the file at the right path, e.g.
   `content/cambridge/igcse/mathematics/algebra/factorising.mdx`
   - `<curriculum>` and `<level>` must match slugs in `src/lib/curriculum.ts`
     (levels accept stage slugs like `igcse` or year slugs like `year-8`).
   - `<subject>` must match a slug in `src/lib/subjects.ts`; `<chapter>` one of its chapter ids.
2. Add frontmatter:
   ```mdx
   ---
   title: "Factorising"
   lede: "One-line hook shown under the title."
   ---
   ```
3. Add the topic to `CHAPTER_TOPICS` in `src/lib/chapters.ts` under the chapter id:
   ```ts
   algebra: [
     // …
     { slug: "factorising", title: "Factorising", desc: "…" },
   ],
   ```
4. Write the lesson using the textbook components (`Definition`, `WorkedExample`, `Formula`,
   `Diagram`, `PracticeQuestions`/`PracticeItem`, `Quiz`/`QuizQuestion`, `LearningObjectives`,
   `Summary`, `RelatedTopics`, `Callout`, `CodeBlock` or fenced code blocks, `TryItPython`).
5. `npm run build` — the topic page, sidebar, chapter list, resources page and search index
   all pick it up automatically.

To add a whole chapter: add the chapter to the subject's `chapters` array in `src/lib/subjects.ts`,
add its topics to `CHAPTER_TOPICS`, and write the MDX files.

## Design

The visual design is ported 1:1 from the approved reference into `src/app/globals.css`
(white canvas, charcoal ink, lime `#a3c614` accent, 14/22px radii, 1180px container, system fonts).
Tailwind (`tailwind.config.ts`) extends the theme with the same tokens; fidelity to the
reference always wins over Tailwind purity. Responsive breakpoints at 960px and 620px.

## Deployment notes

- The site is fully static (`out/`). Deploy it to any static host: GitHub Pages, Netlify, Vercel, Cloudflare Pages, or plain nginx.
- `public/.nojekyll` is included so GitHub Pages serves files like `_next/` correctly.
- The Python playground (`TryItPython`) loads Pyodide from the jsDelivr CDN at first use — the
  page works offline except for that widget, which needs network access to the CDN.
- No environment variables, no server, no cookies, no analytics.
