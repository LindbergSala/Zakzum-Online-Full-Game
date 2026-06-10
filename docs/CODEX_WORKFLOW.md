# Codex Workflow For Zakzum Online

## Core Rules

Codex should work in small, clear steps that keep the project easy for a JavaScript student to understand.

All repository content must be written in English.

## Lore And Canon

Before any lore or game content work, read `core-lore.md`.

This includes work on:

- Realms
- Races
- Factions
- Story text
- Starter journey text
- Activity descriptions
- Rewards with lore meaning
- Any player-facing world text

If `core-lore.md` is missing, do not invent lore. Report that the canon file is missing and create only a short documentation note saying that `core-lore.md` must be added before lore-heavy work continues.

## Project Direction

Use:

- Next.js
- JavaScript
- Pages Router
- Prisma
- SQL database
- Mobile-first layout
- Vercel-friendly project structure

Do not use:

- TypeScript
- App Router
- Unnecessary dependencies
- Large rewrites for small changes
- Gameplay systems before the foundation is ready

## Work Style

Codex should:

- Make one small feature or setup change at a time
- Inspect the current repository before editing
- Prefer existing project patterns once they exist
- Keep files and functions simple
- Use readable names
- Avoid clever abstractions too early
- Avoid unrelated refactors
- Keep secrets out of the repository

## Validation

After each meaningful change, run the relevant available checks.

Expected checks once the project supports them:

- `npm run lint`
- `npx prisma validate`
- `npm run build`

If a command is missing, Codex should report that it is unavailable instead of inventing a result.

## Reporting Back

When Codex finishes a task, report:

- Files changed
- What was added
- What was not changed
- Validation results
- Whether `core-lore.md` exists
- Whether the project is using the Pages Router
- Any risks or next recommended step

## Current Foundation Status

The repository now has a minimal JavaScript Next.js app shell using the Pages Router.

Present foundation pieces:

- `package.json`
- `pages` directory
- `public` directory
- `styles` directory or global CSS

Missing foundation pieces:

- `prisma` directory
- `.env` or `.env.example`

The next safe step is to add Prisma setup and a documented SQL database environment variable.
