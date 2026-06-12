# Zakzum Online Character Foundation

Characters are the player-owned records that will later carry saved progress through Zakzum.

The current work is database and API foundation only. Character creation UI, character detail pages, inventory, quests, combat, resting, shops, and activity logs have not been added yet.

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

- No character creation UI exists yet.
- No character detail route exists yet.
- No update or delete character API exists yet.
- Race mechanics have not been added.
- Class mechanics have not been added.
- Inventory has not been added.
- Quests have not been added.
- Combat has not been added.
- Resting has not been added.
- Shops have not been added.
- Activity logs have not been added.

## Next Recommended Step

Build a simple protected character creation UI on the dashboard using the existing `POST /api/characters` route.
