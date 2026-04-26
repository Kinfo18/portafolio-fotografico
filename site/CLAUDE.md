# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `site/` directory (the Astro project root).

```bash
npm run dev        # dev server at http://localhost:4321
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
```

No linter or test runner is configured. Type checking is handled by Astro's built-in tsconfig.

## Architecture

Single-page site (`src/pages/index.astro`) that imports all sections as Astro components. No client-side routing — everything is one scrollable page with anchor links.

**Data flow:** All content (photographer biography, camera specs, photo metadata, award lists) is hardcoded as TypeScript arrays/objects in the component frontmatter (`---` blocks). There is no CMS, API, or Astro content collections. Editing content means editing the relevant component directly.

**Component responsibilities:**

| File | Section | Notes |
|---|---|---|
| `layouts/BaseLayout.astro` | `<head>` shell | Schema.org `Person` JSON-LD, all meta tags, OG/Twitter. Update `siteUrl` here when deploying. |
| `components/Hero.astro` | Above the fold | Uses `fotografa_1-sin fondo.png` (transparent bg). Floating cards are pure CSS animation. |
| `components/Portfolio.astro` | Gallery | `photos` array drives both the masonry grid and the lightbox. Each item has `src`, `alt`, `category` (must match a filter `id`), and `size` (`normal`/`tall`/`wide`/`large`). The `<script>` block handles filtering and lightbox — it runs client-side in the browser. |
| `components/About.astro` | Biography | Contains inline `itemscope`/`itemprop` microdata in addition to the JSON-LD in BaseLayout. |
| `components/Awards.astro` | Prizes + projects | Two separate arrays: `awards` and `projects`. |
| `components/Cameras.astro` | Equipment specs | `cameras` array; each camera has a `specs` array of `{label, value}` pairs. |
| `components/Contact.astro` | Form + social | Form submission is intercepted by client-side JS and shows a visual confirmation only — no backend. Wire up a real endpoint before deploying. |
| `components/Footer.astro` | Footer nav | `currentYear` is generated server-side at build time. |

**CSS architecture:** All design tokens live in `src/styles/global.css` as CSS custom properties on `:root`. Every component uses scoped `<style>` blocks that reference those tokens via `var(--...)`. Do not use Tailwind; there is no utility class framework.

**Color palette (fixed, do not change):**
- `--color1: #ffb3c8` — primary accent, CTAs
- `--color2: #ffc6d5` — hover states, badges
- `--color3: #ffd9e3` — alternate section backgrounds
- `--color4: #ffecf1` — card surfaces
- `--color5: #ffffff` — base background

**Static assets:** All images are in `public/images/` and served as-is (no Astro `<Image>` optimization). To add a new photo category: copy images to `public/images/fotografias/<slug>/`, then add the category to the `categories` array and photo entries to the `photos` array in `Portfolio.astro`.

**Section entrance animations:** `index.astro` attaches an `IntersectionObserver` that adds `.visible` to `.about`, `.awards`, `.cameras`, `.contact` as they scroll into view. Initial `opacity: 0` + `translateY(32px)` is set in a `<style is:global>` block. Animations are fully skipped when `prefers-reduced-motion` is active.
