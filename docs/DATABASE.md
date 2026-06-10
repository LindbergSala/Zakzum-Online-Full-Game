# Zakzum Online Database Foundation

Zakzum Online uses Prisma for database access.

## Database Provider

The intended database is PostgreSQL.

Do not use SQLite as the deployed database. The project is being built with Vercel deployment in mind, so production should use a hosted PostgreSQL database.

## Environment Variable

`DATABASE_URL` must be set for local development and on Vercel.

The placeholder format is documented in `.env.example`:

```text
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Do not commit real database passwords, tokens, or connection strings.

## Local Development

Local development requires a PostgreSQL database connection before migrations can run.

Because the current Prisma schema has no models yet, migrations should not be created yet.

## Future Models

Future models should be added step by step as the project needs them.

The next recommended model is `User`, because user accounts should exist before character creation and saved progress.

Do not add character, combat, inventory, quest, map, or gameplay models until the account foundation is ready.
