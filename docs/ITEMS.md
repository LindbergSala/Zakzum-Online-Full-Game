# Zakzum Online Item Foundation

Items are not persisted in the database yet.

The current item foundation is a small starter equipment data file for preview and planning:

```text
lib/game/starterEquipment.js
```

Starter equipment should feel practical, worn, grounded, and useful for survival. Characters should feel like new travelers at the start of a dangerous road, not finished heroes.

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

This preview is not saved inventory.

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

- No item database models exist yet.
- No inventory database models exist yet.
- Starter equipment is not assigned during character creation yet.
- Starter equipment is not saved to a character yet.
- Items do not have stats.
- Items do not have damage values.
- Items do not have armor values.
- Items do not have rarity.
- Items do not have prices.
- Shops have not been added.
- Equipment actions have not been added.

## Next Recommended Step

Add the inventory model foundation. The next step should create persistence for character-owned items before any equipment mechanics, shops, combat, or item rewards are added.
