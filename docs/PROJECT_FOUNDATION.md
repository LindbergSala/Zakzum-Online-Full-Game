# Zakzum Online Project Foundation

## Project Name

Zakzum Online

## Core Concept

Zakzum Online is a DnD-inspired text-based RPG web game. The game is set in Zakzum, an old fantasy world shaped by war, prophecy, crystal power, broken kingdoms, and survival.

The project should grow carefully from a simple foundation into a web game with user accounts, character creation, database-backed progress, and text-based game systems.

## Current Repository Setup

This repository now has a minimal Next.js app shell.

Current setup review:

- `package.json`: present
- `pages` directory: present
- `public` directory: present
- `styles` directory or global CSS: present
- `prisma` directory: present
- `.env`: missing
- `.env.example`: present
- `core-lore.md`: present

The app shell uses JavaScript and the Next.js Pages Router. The Prisma foundation exists with PostgreSQL configured as the database provider.

The protected dashboard shell now exists at `/dashboard`. It is the future home for player characters and saved progress, but character creation and gameplay systems have not been added yet.

Protected character API routes now exist at `/api/characters`. They let logged-in users list and create their own characters.

The protected dashboard now includes a simple character creation UI and character list. Character cards link to read-only character sheets at `/characters/[id]`. Starter equipment preview data exists, the CharacterItem inventory persistence foundation has been added, protected inventory API routes now exist, and the character detail page can show saved inventory. A small equipment rules helper now defines equippable slots for future equip and unequip behavior. The ActivityLog persistence foundation, protected read API route, read-only character detail UI section, automatic `character_created` logging, and automatic `starter_equipment_assigned` logging also exist. Gameplay systems have not been added yet.

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

Prisma has been added after the base Next.js project shell.

The planned database approach is:

- Use Prisma as the database ORM
- Use PostgreSQL as the SQL database provider
- Keep the schema simple and readable
- Add models only when a feature needs them
- Validate Prisma changes with `npx prisma validate`

The first model is `User`, with a simple `UserRole` enum for player and admin accounts.

The `Character` model foundation now exists and belongs to `User`. It stores the first character identity, progression, and survival fields. It now has `items` and `activityLogs` relations for future persisted inventory and character memory, but it does not include quests, combat, shops, resting, map systems, or story systems yet.

Starter equipment data exists in `lib/game/starterEquipment.js`. It is preview-only and is not automatically saved as inventory yet.

The `CharacterItem` model foundation now exists and belongs to `Character`. It stores simple item identity, type, slot, description, quantity, and equipped state.

The `ActivityLog` model foundation now exists and belongs to `Character`. It stores type, title, description, optional JSON details, and creation time for future character timeline records.

Static world location data now exists in `lib/game/worldLocations.js`. It is based on `core-lore.md` and gives future map, travel, quest, shop, and story systems shared realm and location keys. `Character.currentLocation` now stores the starting location key `kingstone`, while UI surfaces display the friendly name `Kingstone`. Basic travel validation rules now exist in `lib/game/travelRules.js`, but no map UI or travel API has been added yet.

Local PostgreSQL development is configured with Docker Compose.

## Early User Account Plan

User accounts should be added early, before character creation or gameplay systems.

The recommended account path is:

1. Create the Next.js Pages Router project.
2. Add Prisma and connect a SQL database.
3. Add a simple user account system.
4. Add character creation after accounts exist.
5. Add gameplay systems after characters can belong to users.

Authentication foundations now exist:

- Password hashing utilities in `lib/auth/password.js`
- Session helpers in `lib/auth/session.js`
- Registration and login API routes
- Registration and login UI pages
- Protected `/account` page
- Protected `/dashboard` shell
- Protected `/api/characters` routes

The Character model foundation, protected character API routes, dashboard character creation UI, read-only character detail page, starter equipment preview data, CharacterItem inventory persistence foundation, protected inventory API routes, basic inventory UI, equipment rules helper, ActivityLog persistence foundation, protected activity log read API route, read-only activity log UI section, automatic `character_created` logging, automatic `starter_equipment_assigned` logging, static world location data, and travel validation rules exist. Gameplay systems have not been added yet.

## Core Lore Rule

`core-lore.md` is the canon source for Zakzum Online.

Before adding lore, game content, realm data, story text, race descriptions, faction descriptions, or setting-heavy gameplay text, read `core-lore.md` first.

If `core-lore.md` is missing in the future, do not invent lore. Add only a short project note that `core-lore.md` must be restored or added before lore-heavy work continues.

## Next Recommended Build Order

Recommended next steps:

1. Add the next deliberate automatic activity log source only after its owning system exists.
2. Add protected equip and unequip API routes that reuse the equipment rules helper.
3. Add starter journey content only after character ownership is stable.
4. Add broader gameplay systems after the saved-progress foundation works.

Do not add combat, quests, inventory, maps, or gameplay data before the base project, database, accounts, and character ownership are ready.
