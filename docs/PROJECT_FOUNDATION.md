# Zakzum Online Project Foundation

## Project Name

Zakzum Online

## Core Concept

Zakzum Online is a DnD-inspired text-based RPG web game. The game is set in Zakzum, an old fantasy world shaped by war, prophecy, crystal power, broken kingdoms, and survival.

The project should grow carefully from a simple foundation into a web game with user accounts, character creation, database-backed progress, and text-based game systems.

## Current Repository Setup

This repository is not yet a Next.js project.

Current setup review:

- `package.json`: missing
- `pages` directory: missing
- `public` directory: missing
- `styles` directory or global CSS: missing
- `prisma` directory: missing
- `.env`: missing
- `.env.example`: missing
- `core-lore.md`: present

Because the Next.js project has not been created yet, future setup work should start by scaffolding a small JavaScript Next.js project that uses the Pages Router.

## Tech Stack

Required project stack:

- Next.js
- JavaScript
- Pages Router
- Prisma
- SQL database
- User accounts early in the project
- Mobile-first layout
- Vercel deployment in mind

Do not use TypeScript unless the project owner changes this rule.

## Pages Router Requirement

Zakzum Online must use the Next.js Pages Router.

Expected routing structure after setup:

- `pages/index.js`
- `pages/_app.js`
- API routes under `pages/api`

Do not use the App Router. Do not create an `app` directory for routes.

## JavaScript-Only Requirement

All application code should be written in JavaScript.

Use these file types unless there is a clear reason not to:

- `.js`
- `.jsx` only if the project later chooses that convention
- `.css`
- `.md`

Avoid TypeScript files such as `.ts` and `.tsx`.

## Mobile-First Requirement

The interface should be designed mobile-first from the beginning.

Future UI work should:

- Start with small screens first
- Keep navigation simple
- Keep text readable on phones
- Avoid dense desktop-only layouts
- Add larger-screen improvements after the mobile layout works

## Vercel Deployment Requirement

The project should stay compatible with Vercel deployment.

Future setup should:

- Use standard Next.js scripts
- Keep environment variables documented
- Avoid local-only server assumptions
- Use a hosted SQL database for production
- Keep build steps simple

## Prisma And Database Plan

Prisma should be added after the base Next.js project exists.

The planned database approach is:

- Use Prisma as the database ORM
- Use a SQL database
- Keep the schema simple and readable
- Add models only when a feature needs them
- Validate Prisma changes with `npx prisma validate`

Do not create database models during foundation documentation work.

## Early User Account Plan

User accounts should be added early, before character creation or gameplay systems.

The recommended account path is:

1. Create the Next.js Pages Router project.
2. Add Prisma and connect a SQL database.
3. Add a simple user account system.
4. Add character creation after accounts exist.
5. Add gameplay systems after characters can belong to users.

Authentication has not been added yet.

## Core Lore Rule

`core-lore.md` is the canon source for Zakzum Online.

Before adding lore, game content, realm data, story text, race descriptions, faction descriptions, or setting-heavy gameplay text, read `core-lore.md` first.

If `core-lore.md` is missing in the future, do not invent lore. Add only a short project note that `core-lore.md` must be restored or added before lore-heavy work continues.

## Next Recommended Build Order

Recommended next steps:

1. Scaffold a minimal Next.js project with JavaScript and the Pages Router.
2. Add basic mobile-first global styling.
3. Add `public` and `styles` directories if the scaffold does not create them.
4. Add Prisma with a SQL database connection.
5. Add `.env.example` with required variable names, but no secrets.
6. Add user accounts.
7. Add character creation.
8. Add the first database-backed activity log foundation.
9. Add starter journey content only after the foundation is stable.

Do not add combat, quests, inventory, maps, or gameplay data before the base project, database, accounts, and character ownership are ready.
