# Zakzum Online Character Foundation

Characters are the player-owned records that will later carry saved progress through Zakzum.

The current work includes the database model, protected API routes, a simple protected character creation UI on `/dashboard`, a read-only character detail page, starter equipment preview data, persisted inventory, and the activity log model foundation with a protected read API route and read-only UI section.

Character update and delete actions, activity log write routes, quests, combat, resting, shops, and map systems have not been added yet.

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
- `items`
- `activityLogs`
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

It also includes sections for Activity Log, Equipment, and future Actions.

The Equipment section explains that inventory persistence is coming soon.

The Starter Equipment Preview section shows class-based starter equipment from `lib/game/starterEquipment.js`. This is preview-only data and is not saved as character inventory yet.

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

## Starter Equipment Data

Starter equipment data now exists in `lib/game/starterEquipment.js`.

Starter equipment is based on the character's class:

- Warrior
- Ranger
- Rogue
- Cleric
- Mage
- Paladin
- Bard
- Druid

Each starter item currently has:

- `key`
- `name`
- `type`
- `slot`
- `description`

The current item data is meant to help future inventory work assign grounded starter gear when a character is created. It does not create saved inventory yet.

## Character Items

The `CharacterItem` Prisma model now exists as the persisted inventory foundation.

Each `CharacterItem` belongs to one `Character`, and deleting a character deletes that character's item records through cascade deletion.

Protected inventory API routes now exist for listing character-owned items and assigning starter equipment once. The character detail page now shows saved inventory and can assign starter equipment once when inventory is empty. Automatic starter equipment assignment during character creation has not been added yet.

## Activity Logs

The `ActivityLog` Prisma model now exists as the persisted activity log foundation.

Each `ActivityLog` belongs to one `Character`, and deleting a character deletes that character's activity log records through cascade deletion.

The protected read route `GET /api/characters/[id]/activity-logs` now returns logs for a character owned by the logged-in user.

The character detail page now shows a read-only Activity Log section. It loads logs from the protected read route and shows `No recorded activity yet.` when the character has no logs.

Activity log write routes and automatic activity logging have not been added yet.

## Current Limitations

- No update or delete character API exists yet.
- Character detail is read-only.
- Race mechanics have not been added.
- Class mechanics have not been added.
- Inventory persistence, protected inventory API routes, and basic inventory UI exist.
- Equip and unequip actions have not been added.
- Starter equipment is preview-only.
- Quests have not been added.
- Combat has not been added.
- Resting has not been added.
- Shops have not been added.
- Activity log persistence, the protected read API route, and the read-only UI section exist, but write routes have not been added.

## Next Recommended Step

Plan exactly which future systems should write activity logs. Gameplay systems should still wait until character ownership, inventory display, and activity log ownership are stable.
