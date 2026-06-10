# Zakzum Online Authentication Foundation

## Current Status

Zakzum Online has the database foundation for user accounts, but full authentication has not been built yet.

Current authentication-related pieces:

- The `User` model exists in `prisma/schema.prisma`.
- The `UserRole` enum exists in `prisma/schema.prisma`.
- The initial User migration file exists at `prisma/migrations/20260610130000_add_user_model/migration.sql`.
- The migration should be applied before using database-backed auth routes.
- Password helper functions exist in `lib/auth/password.js`.
- The registration API route exists at `POST /api/auth/register`.

No registration pages, login pages, login API route, sessions, cookies, or test users exist yet.

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

## Registration API

`POST /api/auth/register` creates a new user account.

Expected JSON body:

```json
{
  "email": "player@example.com",
  "username": "playername",
  "password": "example-password"
}
```

The route:

- Accepts only `POST` requests.
- Trims and lowercases `email`.
- Trims `username`.
- Requires `email`, `username`, and `password`.
- Requires `username` to be at least 3 characters.
- Requires `password` to be at least 8 characters.
- Rejects duplicate email or username with status `409`.
- Stores only `passwordHash`, never the plain text password.

Safe response shape:

```json
{
  "user": {
    "id": "user_id",
    "email": "player@example.com",
    "username": "playername",
    "role": "PLAYER",
    "createdAt": "date"
  }
}
```

The response must never include `passwordHash`.

No session or cookie is created yet.

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

Add the login API route next. Sessions and UI pages should come after registration and login APIs are working.
