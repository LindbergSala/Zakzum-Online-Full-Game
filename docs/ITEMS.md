# Zakzum Online Item Foundation

The persisted inventory foundation now exists through the `CharacterItem` Prisma model.

Starter equipment preview data still lives in:

```text
lib/game/starterEquipment.js
```

Starter equipment should feel practical, worn, grounded, and useful for survival. Characters should feel like new travelers at the start of a dangerous road, not finished heroes.

The protected inventory API foundation now exists. The character detail page now has a simple saved inventory UI.

## Starter Equipment Data Summary

Starter equipment is currently class-based.

Each supported class has a small starter kit:

- Warrior
- Ranger
- Rogue
- Cleric
- Mage
- Paladin
- Bard
- Druid

The read-only character detail page at `/characters/[id]` shows a Starter Equipment Preview based on the character's class.

This preview is still not saved inventory. Starter equipment is not automatically assigned when a character is created yet.

Starter equipment can be assigned to a character through the protected inventory API or the character detail UI only when that character's inventory is empty.

## CharacterItem Persistence

The `CharacterItem` model is the first database foundation for character-owned inventory.

Each `CharacterItem` belongs to one `Character`.

Stored fields are:

- `id`
- `characterId`
- `key`
- `name`
- `type`
- `slot`
- `description`
- `quantity`
- `isEquipped`
- `createdAt`
- `updatedAt`

Deleting a character deletes that character's items through the Prisma relation cascade.

## Inventory API Summary

The protected inventory API route is:

```text
/api/characters/[id]/inventory
```

Supported methods:

- `GET`
- `POST`

Both methods require a valid logged-in user and verify that the requested character belongs to that user.

If the character does not exist or belongs to another user, the route returns `404`.

`GET /api/characters/[id]/inventory` returns the character's persisted `CharacterItem` records ordered by `createdAt` ascending.

`POST /api/characters/[id]/inventory` currently supports one action:

```json
{
  "action": "assignStarterEquipment"
}
```

This action:

- Ignores item data from the request body.
- Ignores `characterId` from the request body.
- Uses the character's saved `characterClass`.
- Uses `getStarterEquipmentForClass(characterClass)`.
- Creates one `CharacterItem` record for each starter item.
- Sets `quantity` to `1`.
- Sets `isEquipped` to `true` for `mainHand`, `offHand`, and `body` slots.
- Sets `isEquipped` to `false` for `pack` and `none` slots.

Starter equipment can only be assigned when the character's inventory is empty. If the character already has items, the route returns `409`.

The response never includes `passwordHash` or raw session tokens.

Starter equipment assignment does not write an activity log yet. Activity logging should be added in a separate step after activity log API behavior is defined.

## Character Detail Inventory UI

`/characters/[id]` now shows saved inventory from `CharacterItem` records.

The character detail page:

- Calls `GET /api/characters/[id]/inventory` when it loads in the browser.
- Shows `No saved equipment yet.` when the inventory is empty.
- Shows each saved item with name, type, slot, quantity, equipped status, and description.
- Shows an `Assign Starter Equipment` button only when the saved inventory is empty.
- Calls `POST /api/characters/[id]/inventory` with `action: "assignStarterEquipment"`.
- Refreshes saved inventory after starter equipment is assigned.
- Handles duplicate starter assignment safely if the API returns `409`.

The Starter Equipment Preview section remains reference-only. Saved inventory appears in the Equipment section.

## Item Object Shape

Each starter item is a plain JavaScript object:

```js
{
  key: "warrior-notched-iron-sword",
  name: "Notched Iron Sword",
  type: "weapon",
  slot: "mainHand",
  description: "A plain road blade with old chips along the edge."
}
```

Required fields:

- `key`
- `name`
- `type`
- `slot`
- `description`

## Current Item Types

Current item types are intentionally simple:

- `weapon`
- `armor`
- `tool`
- `focus`
- `supply`

## Current Item Slots

Current item slots are intentionally simple:

- `mainHand`
- `offHand`
- `body`
- `pack`
- `none`

## Current Limitations

- No global `Item` database model exists yet.
- Starter equipment is not assigned during character creation yet.
- Starter equipment is not assigned automatically.
- Inventory UI is limited to listing saved items and assigning starter equipment once.
- Update, delete, equip, and unequip item routes have not been added yet.
- Equip and unequip UI has not been added yet.
- Items do not have stats.
- Items do not have damage values.
- Items do not have armor values.
- Items do not have rarity.
- Items do not have prices.
- Shops have not been added.
- Equipment actions have not been added.
- Activity logs are not written by item actions yet.

## Next Recommended Step

Add a carefully scoped equip and unequip plan, or add the first activity log foundation before item mechanics. Equipment mechanics, shops, combat, and item rewards should still wait.
