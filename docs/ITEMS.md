# Zakzum Online Item Foundation

The persisted inventory foundation now exists through the `CharacterItem` Prisma model.

Starter equipment preview data still lives in:

```text
lib/game/starterEquipment.js
```

Starter equipment should feel practical, worn, grounded, and useful for survival. Characters should feel like new travelers at the start of a dangerous road, not finished heroes.

The inventory API and inventory UI have not been added yet.

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
- Starter equipment is not saved to a character yet.
- Inventory API routes have not been added yet.
- Inventory UI has not been added yet.
- Items do not have stats.
- Items do not have damage values.
- Items do not have armor values.
- Items do not have rarity.
- Items do not have prices.
- Shops have not been added.
- Equipment actions have not been added.

## Next Recommended Step

Apply the CharacterItem migration locally when Docker PostgreSQL is running, then add protected inventory API routes in a separate step. Equipment mechanics, shops, combat, and item rewards should still wait.
