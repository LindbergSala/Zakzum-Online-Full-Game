# Zakzum Online Authentication Foundation

## Current Status

Zakzum Online has the database foundation for user accounts, but full authentication has not been built yet.

Current authentication-related pieces:

- The `User` model exists in `prisma/schema.prisma`.
- The `UserRole` enum exists in `prisma/schema.prisma`.
- The initial User migration file exists at `prisma/migrations/20260610130000_add_user_model/migration.sql`.
- The migration should be applied before using database-backed auth routes.
- Password helper functions exist in `lib/auth/password.js`.
- Session helper functions exist in `lib/auth/session.js`.
- Current user lookup for server-side code exists in `lib/auth/currentUser.js`.
- The registration API route exists at `POST /api/auth/register`.
- The login API route exists at `POST /api/auth/login`.
- The current-user API route exists at `GET /api/auth/me`.
- The logout API route exists at `POST /api/auth/logout`.
- The registration page exists at `/register`.
- The login page exists at `/login`.
- The first protected page exists at `/account`.

No middleware, complex role permissions, character creation, gameplay systems, or test users exist yet.

## Password Storage

Passwords must never be stored as plain text.

The `User` model uses `passwordHash` for storing hashed passwords. Future registration code should call `hashPassword(password)` before creating a user record.

Future login code should call `verifyPassword(password, user.passwordHash)` when checking credentials.

## Registration Flow

Registration currently creates an account only. It does not start a session.

1. Accept an email, username, and password from a registration form.
2. Validate the email, username, and password.
3. Hash the password with `hashPassword`.
4. Create a `User` record with `passwordHash`.
5. Send the user through login to start a session.

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

## Registration Page

`/register` provides the first account creation UI.

The page:

- Uses a mobile-first form.
- Collects email, username, and password.
- Calls `POST /api/auth/register`.
- Shows loading, error, and success states.
- Tells the user to log in after a successful registration.
- Links to `/login`.
- Never displays `passwordHash`.

## Login Flow

The login API now supports credential verification and sets an HttpOnly session cookie.

1. Accept an email or username and password from a login form.
2. Find the matching `User` record.
3. Compare the submitted password with `verifyPassword`.
4. Reject invalid credentials with a generic error.
5. Create a signed session token.
6. Set the token in an HttpOnly cookie.

## Login API

`POST /api/auth/login` verifies a user's login credentials.

Expected JSON body:

```json
{
  "identifier": "player@example.com",
  "password": "example-password"
}
```

The `identifier` field may be either an email address or a username.

The route:

- Accepts only `POST` requests.
- Trims `identifier`.
- Treats identifiers containing `@` as email addresses and lowercases them.
- Treats other identifiers as usernames.
- Requires `identifier` and `password`.
- Requires `password` to be at least 8 characters.
- Uses `verifyPassword(password, user.passwordHash)`.
- Returns the same generic `401` error for an unknown account or a wrong password.
- Sets an HttpOnly session cookie after successful password verification.

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

The raw session token is stored only in the cookie and must not be returned in the JSON response.

## Session Cookie Behavior

Sessions use a signed token stored in an HttpOnly cookie named `zakzum_session`.

The session token contains only safe session data:

- `userId`
- `email`
- `username`
- `role`

The session token must never contain:

- `password`
- `passwordHash`

Cookie settings:

- `httpOnly: true`
- `sameSite: "lax"`
- `path: "/"`
- `secure: true` in production
- `secure: false` in local development

Sessions currently expire after 7 days.

`AUTH_SESSION_SECRET` is required to sign and verify session tokens. It must be set locally in `.env` and in Vercel project environment variables.

## Current User API

`GET /api/auth/me` returns the current logged-in user.

The route:

- Accepts only `GET` requests.
- Reads the session cookie.
- Verifies the signed session token.
- Returns `401` when no valid session exists.
- Looks up the user by id from the session.
- Returns safe user data only.

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

## Logout API

`POST /api/auth/logout` clears the session cookie.

The route:

- Accepts only `POST` requests.
- Clears the `zakzum_session` cookie.
- Returns a simple success response.

## Login Page

`/login` provides the first account login UI.

The page:

- Uses a mobile-first form.
- Collects an identifier and password.
- Explains that the identifier can be an email or username.
- Calls `POST /api/auth/login`.
- Calls `GET /api/auth/me` after successful login to confirm the session.
- Shows safe current user data: username, email, and role.
- Links to `/account` after the session is confirmed.
- Calls `POST /api/auth/logout` when the user logs out.
- Clears local UI session state after logout.
- Never displays `passwordHash`.
- Never displays the raw session token.

## Protected Account Page

`/account` is the first protected page foundation.

The page:

- Uses `getServerSideProps`.
- Reads and verifies the session cookie on the server.
- Looks up the user by id through `lib/auth/currentUser.js`.
- Redirects unauthenticated users to `/login`.
- Shows safe account data only: username, email, and role.
- Shows a note that character creation is coming soon.
- Links back to the homepage.
- Calls `POST /api/auth/logout` and then sends the user to `/login`.
- Never displays `passwordHash`.
- Never displays the raw session token.

Middleware and protected redirects outside `/account` have not been added yet.

Character creation has not been added yet.

## Vercel And Environment Notes

Vercel must have `DATABASE_URL` configured before database-backed auth can work.

Vercel must also have `AUTH_SESSION_SECRET` configured before session cookies can work. Do not create real secrets in the repository.

## Next Recommended Step

Add the next protected account-area foundation, such as a simple dashboard shell. Character creation and gameplay systems should come after protected account access is ready.
