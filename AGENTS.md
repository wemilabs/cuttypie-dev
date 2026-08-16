<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: lisham.dev (personal portfolio + blog)

## Stack

- Next.js (App Router, Turbopack, Cache Components enabled, React Compiler)
- React 19, TypeScript 7 (strict)
- Tailwind CSS v4 (CSS-first config in `app/globals.css`) + shadcn/ui components
- Blog posts are local markdown in `content/blog/`, rendered with unified/remark/rehype + shiki

## Commands

- `pnpm dev` — dev server (Turbopack)
- `pnpm build` — production build (includes type checking)
- `pnpm lint` — Biome check (lint + format + import sorting)
- `pnpm format` — Biome format, writes changes
- `pnpm exec biome check --write .` — auto-fix lint/format issues
- Blog content management: `pnpm create-post`, `pnpm draft-post`, `pnpm publish-draft`, etc. (see `scripts/`)

## Conventions

- Package manager: pnpm (never npm/yarn)
- Linter/formatter: Biome (`biome.json`) — ESLint/Prettier are not used
- Functional components only, prefer React Server Components; keep client components small
- Path alias: `@/*` maps to repo root
- Prefer semantic Tailwind tokens (`bg-background`, `text-muted-foreground`, ...) over hardcoded colors
- Verify changes with `pnpm lint` and `pnpm build` before committing

## Agent skills

Installed under `.devin/skills/`:

- `next-dev-loop` — inspect/edit/verify loop against the running dev server
- `next-partial-prefetching-adoption` — workflow for adopting Partial Prefetching
