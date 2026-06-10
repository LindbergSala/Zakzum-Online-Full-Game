# Zakzum Online Authentication Foundation

## Current Status

Zakzum Online has the database foundation for user accounts, but full authentication has not been built yet.

Current authentication-related pieces:

- The `User` model exists in `prisma/schema.prisma`.
- The `UserRole` enum exists in `prisma/schema.prisma`.
- The initial User migration file exists at `prisma/migrations/20260610130000_add_user_model/migration.sql`.
- The migration may not be applied yet.
- Password helper functions exist in `lib/auth/password.js`.

No registration pages, login pages, API routes, sessions, cookies, or test users exist yet.

## Password Storage

Passwords must never be stored as plain text.

The `User` model uses `passwordHash` for storing hashed passwords. Future registration code should call `hashPassword(password)` before creating a user record.

Future login code should call `verifyPassword(password, user.passwordHash)` when checking credentials.

## Planned Registration Flow

The planned registration flow is:

1. Accept an email, username, and password from a registration form.
2. Validate the email, username, and password.
3. Hash the password with `hashPassword`.
4. Create a `User` record with `passwordHash`.
5. Start a session only after session handling exists.

## Planned Login Flow

The planned login flow is:

1. Accept an email or username and password from a login form.
2. Find the matching `User` record.
3. Compare the submitted password with `verifyPassword`.
4. Reject invalid credentials with a generic error.
5. Start a session only after session handling exists.

## Planned Session And Cookie Flow

Sessions have not been added yet.

Future session work should:

- Use secure, HTTP-only cookies.
- Avoid storing passwords or password hashes in cookies.
- Keep session secrets in environment variables.
- Document all required environment variables in `.env.example`.
- Keep Vercel deployment in mind.

## Vercel And Environment Notes

Vercel must have `DATABASE_URL` configured before database-backed auth can work.

Future session work may need another secret environment variable, such as `SESSION_SECRET`. Do not create real secrets in the repository.

## Next Recommended Step

Apply the existing initial Prisma migration after a valid local PostgreSQL `DATABASE_URL` is available. After the migration is applied, add registration and login API routes before building UI pages.
