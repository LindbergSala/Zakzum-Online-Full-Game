# Zakzum Online Character Foundation

Characters are the player-owned records that will later carry saved progress through Zakzum.

The current work includes the database model, protected API routes, a simple protected character creation UI on `/dashboard`, and a read-only character detail page.

Character update and delete actions, inventory, quests, combat, resting, shops, and activity logs have not been added yet.

## Character Model Summary

The `Character` model belongs to `User`.

Each character includes:

- `id`
- `userId`
- `name`
- `race`
- `characterClass`
- `level`
- `experience`
- `gold`
- `stamina`
- `maxStamina`
- `stress`
- `renown`
- `currentLocation`
- `createdAt`
- `updatedAt`

The current default location is `Kingstone`.

Deleting a user deletes that user's characters through the Prisma relation cascade.

## Character API Summary

The protected character API route is:

```text
/api/characters
```

Supported methods:

- `GET`
- `POST`

Both methods require a valid logged-in user.

`GET /api/characters` returns only characters owned by the logged-in user, ordered by `createdAt` ascending.

`POST /api/characters` creates a character for the logged-in user.

Expected body:

```json
{
  "name": "Aldren",
  "race": "Human",
  "characterClass": "Warrior"
}
```

The API ignores `userId` from the request body. Character ownership always comes from the logged-in session user.

The response must never include `passwordHash` or a raw session token.

The protected single-character API route is:

```text
/api/characters/[id]
```

Supported methods:

- `GET`

`GET /api/characters/[id]` requires a valid logged-in user and returns only a character owned by that user. If the character does not exist or belongs to another user, the route returns `404`.

The response contains safe character data only. It does not include user data, `passwordHash`, or raw session tokens.

## Dashboard Character Creation UI

`/dashboard` now includes the first character creation UI.

The dashboard:

- Calls `GET /api/characters` when it loads in the browser.
- Shows existing characters owned by the logged-in user.
- Shows `No characters yet.` when the user has no characters.
- Uses race options from `lib/game/characterOptions.js`.
- Uses class options from `lib/game/characterOptions.js`.
- Calls `POST /api/characters` to create a new character.
- Refreshes the character list after successful creation.
- Shows simple loading, error, and success states.

The UI must never display `passwordHash` or raw session tokens.

Character cards on `/dashboard` link to the read-only character sheet at `/characters/[id]`.

## Read-Only Character Detail Page

`/characters/[id]` is a protected Pages Router page that uses `getServerSideProps`.

If there is no valid logged-in user, the page redirects to `/login`.

If the requested character does not exist or does not belong to the logged-in user, the page returns `notFound: true`.

The page shows:

- `name`
- `race`
- `characterClass`
- `level`
- `experience`
- `gold`
- `stamina`
- `maxStamina`
- `stress`
- `renown`
- `currentLocation`
- `createdAt`

It also includes placeholder sections for Journey Record, Equipment, and future Actions.

## Allowed Races

- Human
- Elf
- Aasimar
- Half-Elf
- Goliath
- Dwarf
- Gnome
- Halfling
- Sea-King
- Islander
- Corsair
- Beast-Clan
- Outcast Dwarf
- Dragonborn
- Orc
- Troll
- Half-Orc
- Goblin
- Tiefling

## Allowed Classes

- Warrior
- Ranger
- Rogue
- Cleric
- Mage
- Paladin
- Bard
- Druid

## Current Limitations

- No update or delete character API exists yet.
- Character detail is read-only.
- Race mechanics have not been added.
- Class mechanics have not been added.
- Inventory has not been added.
- Quests have not been added.
- Combat has not been added.
- Resting has not been added.
- Shops have not been added.
- Activity logs have not been added.

## Next Recommended Step

Add the next small character foundation step, such as a planning document for activity logs or a carefully scoped starter equipment model. Gameplay systems should still wait until character ownership and display are stable.
