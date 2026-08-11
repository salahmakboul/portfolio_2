# Salah Makboul — Portfolio

A single-page portfolio site with a WebGL/Canvas2D hero, scroll-driven storytelling, and an on-page assistant that answers questions about the work — no backend.

## Quickstart

```bash
npm install
npm run dev
```

Open http://localhost:3000. Requires Node 20+. No env vars, no API keys, no backend to stand up.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Vite dev server, port 3000 |
| `npm run build` | Typecheck (`tsc -b`) then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

## Stack

React 19 + TypeScript + Vite + Tailwind. GSAP/ScrollTrigger drives scroll reveals, Lenis provides smooth scroll, three.js powers the optional 3D hero, Framer Motion powers the discrete UI overlays (command palette, project modal, SalahAI panel).

## Where things live

- **`src/lib/data.ts`** — the single source of truth for site content: projects, stack, timeline, services. Edit content here, not in JSX.
- **`src/sections/`** — one file per page section, composed in `src/pages/Home.tsx`.
- **`src/components/ui/`** — generated shadcn primitives, currently unused by the app (every section hand-rolls its own Tailwind classes to match the site's specific visual language). Kept in case you want to adopt them; their color tokens aren't wired to real values yet.

## Notable decisions

- **Hero background defaults to 2D** (`HeroCanvas2D.tsx`, plain Canvas2D, no dependencies) for fast first paint. The WebGL aurora version (`HeroCanvas.tsx`, three.js) is lazy-loaded only when the user clicks "3D mode" in the hero.
- **SalahAI is not a live LLM.** It's a deterministic keyword-matched engine (`src/lib/salahai.ts`) that answers strictly from `lib/data.ts`, so responses can never drift from what's actually on the page. Swap in a real API later by replacing `answer()`; the UI layer (`SalahAI.tsx`) doesn't care.
- **GitHub stats** (`GitHubSection.tsx`) call the public, unauthenticated `api.github.com` REST API client-side and fall back to a static snapshot (`FALLBACK_STATS` in `data.ts`) if the request fails or gets rate-limited.
- Motion respects `prefers-reduced-motion` throughout (`lib/anim.ts#prefersReducedMotion`) — scroll reveals, hero canvases, and SalahAI all check it.

## Deploy

`npm run build` outputs a fully static `dist/`. `vite.config.ts` uses relative base paths (`base: './'`), so it works from any subpath or static host (Netlify, Vercel, GitHub Pages, S3) with zero config.
