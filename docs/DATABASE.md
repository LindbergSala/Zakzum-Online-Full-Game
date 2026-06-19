# Zakzum Online Database Foundation

Zakzum Online uses Prisma for database access.

## Database Provider

The intended database is PostgreSQL.

Do not use SQLite as the deployed database. The project is being built with Vercel deployment in mind, so production should use a hosted PostgreSQL database.

## Environment Variables

`DATABASE_URL` must be set for local development and on Vercel.

The placeholder format is documented in `.env.example`:

```text
DATABASE_URL="postgresql://zakzum:zakzum_dev_password@localhost:55432/zakzum_online_dev?schema=public"
```

Do not commit real database passwords, tokens, or connection strings.

`DATABASE_URL` is the runtime connection string used by the application.

When using the Vercel Postgres/Neon integration:

- Set `DATABASE_URL` in Vercel Project Settings, under Environment Variables.
- Enable it for Production, and usually also Preview and Development.
- Use the PostgreSQL connection string from the Vercel Storage/Neon integration.
- Keep `AUTH_SESSION_SECRET` set to a long random value.
- Keep real database URLs and session secrets in Vercel, not in GitHub.

This project uses Prisma, so do not add the `comments` example table or the `@neondatabase/serverless` sample form from the generic Vercel guide unless a feature specifically needs raw SQL access.

## Local Development

Local development uses PostgreSQL through Docker Compose.

The local Docker service runs PostgreSQL inside the container on port `5432` and exposes it on host port `55432`. The host port avoids conflicts with other PostgreSQL services that may already use common PostgreSQL ports such as `5432` or `5433`.

To start local database work:

1. Copy `.env.example` to `.env` on your machine.
2. Keep the local Docker `DATABASE_URL` unless you use a different local PostgreSQL database.
3. Start PostgreSQL:

```bash
npm run db:up
```

4. Apply pending migrations locally:

```bash
npm run db:migrate
```

5. Validate the Prisma schema:

```bash
npm run db:validate
```

6. Stop the local database when finished:

```bash
npm run db:down
```

`docker compose down` stops the database container but keeps the local database volume.

`docker compose down -v` stops the database and deletes the local PostgreSQL volume. This removes local database data.

Do not run migrations unless `DATABASE_URL` points to a valid local PostgreSQL database.

## Database Scripts

The project includes simple package scripts for local database work:

- `npm run db:up` starts the local PostgreSQL container.
- `npm run db:down` stops the local PostgreSQL container and keeps the volume.
- `npm run db:reset` stops the local PostgreSQL container and deletes the local volume.
- `npm run db:migrate` applies pending migrations locally with Prisma.
- `npm run db:validate` validates `prisma/schema.prisma`.
- `npm run db:studio` opens Prisma Studio.

Use `npm run db:reset` carefully. It deletes local database data.

`npm run db:migrate` uses `prisma migrate dev` and is only for local development.

For Vercel and production, the `build` script runs:

```bash
prisma migrate deploy && prisma generate && next build
```

`prisma migrate deploy` applies existing migration files in production. Do not use `prisma migrate dev` in Vercel builds.

## Migrations

The initial migration file exists at:

```text
prisma/migrations/20260610130000_add_user_model/migration.sql
```

This migration creates:

- The `UserRole` enum
- The `User` table
- A unique index for `email`
- A unique index for `username`

The Character migration file exists at:

```text
prisma/migrations/20260612220435_add_character_model/migration.sql
```

This migration creates:

- The `Character` table
- An index on `userId`
- A foreign key from `Character.userId` to `User.id`
- `ON DELETE CASCADE` so local character records are removed when their owning user is removed

The CharacterItem migration file exists at:

```text
prisma/migrations/20260615120000_add_character_item_model/migration.sql
```

This migration creates:

- The `CharacterItem` table
- An index on `characterId`
- A foreign key from `CharacterItem.characterId` to `Character.id`
- `ON DELETE CASCADE` so item records are removed when their owning character is removed

The ActivityLog migration file exists at:

```text
prisma/migrations/20260615133609_add_activity_log_model/migration.sql
```

This migration creates:

- The `ActivityLog` table
- An index on `characterId`
- An index on `characterId` and `createdAt`
- A foreign key from `ActivityLog.characterId` to `Character.id`
- `ON DELETE CASCADE` so activity log records are removed when their owning character is removed

The current migrations have been applied to the local Docker PostgreSQL database.

For deployment, use the Prisma and Vercel migration flow with a real production `DATABASE_URL` value. Do not use the local Docker database for production.

## Current Models

### User

The `User` model is the first account foundation for Zakzum Online.

It includes:

- A generated string `id`
- Unique `email`
- Unique `username`
- `passwordHash` for future password-based authentication
- `role` using the `UserRole` enum
- `characters` relation for account-owned characters
- `createdAt` and `updatedAt` timestamps

`UserRole` currently supports:

- `PLAYER`
- `ADMIN`

This model is the account owner for future saved progress.

### Character

The `Character` model is the first player character foundation for Zakzum Online.

Each character belongs to one `User`.

It includes:

- A generated string `id`
- `userId` and a required `User` relation
- `name`, `race`, and `characterClass`
- Basic progression fields: `level`, `experience`, `gold`, and `renown`
- Early survival fields: `stamina`, `maxStamina`, and `stress`
- `currentLocation`, defaulting to `Kingstone`
- `items` relation for character-owned inventory records
- `activityLogs` relation for character-owned activity records
- `createdAt` and `updatedAt` timestamps

The relation uses `onDelete: Cascade`, so deleting a user deletes that user's characters.

This model does not include quests, combat, shops, resting, map systems, or story systems yet.

### CharacterItem

The `CharacterItem` model is the first persisted inventory foundation for Zakzum Online.

Each item record belongs to one `Character`.

It includes:

- A generated string `id`
- `characterId` and a required `Character` relation
- `key`, `name`, `type`, `slot`, and `description`
- `quantity`, defaulting to `1`
- `isEquipped`, defaulting to `false`
- `createdAt` and `updatedAt` timestamps

The relation uses `onDelete: Cascade`, so deleting a character deletes that character's item records.

This model does not include item stats, damage values, armor values, rarity, prices, global item templates, shops, or equipment actions yet.

### ActivityLog

The `ActivityLog` model is the first database foundation for the character's living memory.

Each activity log record belongs to one `Character`.

It includes:

- A generated string `id`
- `characterId` and a required `Character` relation
- `type` as a string for flexible early system design
- `title`
- `description`
- Optional `details` JSON
- `createdAt`

The relation uses `onDelete: Cascade`, so deleting a character deletes that character's activity log records.

The model includes indexes on `characterId` and on `characterId` with `createdAt` for future character timeline queries.

This model does not include activity log API routes, activity log UI, automatic logging, quests, combat, resting, map systems, shops, or story systems yet.

## Future Models

Future models should be added step by step as the project needs them.

The next recommended database work is to add protected activity log API routes in a separate small step.

Do not add combat, quest, map, shop, rest, or story models until character ownership, persisted inventory, and activity log ownership are stable.
