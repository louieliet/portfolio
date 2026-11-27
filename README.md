# Emiliano Montes - Portfolio

Personal portfolio of Emiliano Montes. Vanilla Astro 5 (no React, no Tailwind), deployed on Vercel at https://www.louieliet.dev.

## Stack

- Astro 5 static site, plain `.astro` components and `src/lib/*.ts` modules.
- Lenis for smooth scrolling, GSAP for motion.
- pnpm for dependencies.

## Scripts

- `pnpm dev`: local preview.
- `pnpm build`: production build to `dist/`.
- `pnpm preview`: serve the build.
- `pnpm test`: gate tests (`node --test` over `src/lib/*.test.ts`), also run by the pre-commit hook.
- `node scripts/build-og.mjs`: regenerates the 1200x630 case OG images in `public/projects/og/` (needs Google Chrome and macOS `sips`). Rerun when the look changes.

## Where content lives

- `src/lib/data.ts`: all copy and facts (personal info, experience, projects and their case sections).
- `public/`: images, video and fonts. Each `.mp4` has a `.webp` poster beside it.
- `src/styles/global.css` and `DESIGN_SYSTEM.md`: tokens, type, layout and motion rules.

## Where SEO lives

- `src/layouts/Layout.astro`: head tags, Open Graph, Twitter cards, canonical and JSON-LD.
- `src/lib/seo.ts`: site identity, meta descriptions, JSON-LD builders and the sitemap XML.
- `src/pages/sitemap.xml.ts`, `public/robots.txt`, `src/pages/404.astro`.
- `DESIGN_SYSTEM.md`, "SEO and metadata", for the props and rules.
