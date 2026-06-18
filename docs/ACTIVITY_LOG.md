# Zakzum Online Activity Log Foundation

The Activity Log is the living memory of a character.

It should eventually record what the character does, survives, loses, earns, and changes. In Zakzum, progress should feel like a record of the road, not just numbers changing behind the screen.

## Current Status

The database foundation now exists through the `ActivityLog` Prisma model.

The protected read API route now exists for logged-in users to read activity logs for their own characters.

The protected character detail page now displays a read-only Activity Log section.

Public activity log write routes have not been added yet.

Automatic log sources now exist for character creation and starter equipment assignment.

Automatic log sources also exist for successful item equip and unequip actions.

No automatic logs are written yet during rest, travel, combat, quests, or story progress.

## ActivityLog Model Fields

`ActivityLog` includes:

- `id`
- `characterId`
- `character`
- `type`
- `title`
- `description`
- `details`
- `createdAt`

`details` is optional JSON for future structured context.

`type` is a string for now. Do not add an enum until the early gameplay systems are clearer.

## Activity Log API Summary

The protected activity log read route is:

```text
GET /api/characters/[id]/activity-logs
```

The route requires a valid logged-in user.

The route checks that the requested character exists and belongs to the logged-in user. If the character does not exist or belongs to another user, the route returns `404`.

Logs are returned for that character only and are ordered by `createdAt` descending.

Safe response shape:

```json
{
  "activityLogs": [
    {
      "id": "activity_log_id",
      "type": "character_created",
      "title": "First Footstep",
      "description": "A character entered Zakzum.",
      "details": null,
      "createdAt": "2026-06-15T12:00:00.000Z"
    }
  ]
}
```

The response does not include user data, `passwordHash`, or raw session tokens.

No `POST`, `PUT`, `PATCH`, or `DELETE` activity log routes exist yet.

## Automatic Log Sources

### Character Creation

The first deliberate automatic log source is character creation.

When a logged-in user creates a character through:

```text
POST /api/characters
```

the server creates one `ActivityLog` record for the new character.

The log uses:

- `type`: `character_created`
- `title`: `Character Created`
- `description`: `The road remembers the first step.`

The log details store:

- `characterName`
- `race`
- `characterClass`
- `currentLocation`

This log is connected to the newly created character. It is created by the server during character creation, not by a public activity log write route.

### Starter Equipment Assignment

The second deliberate automatic log source is starter equipment assignment.

When a logged-in user assigns starter equipment through:

```text
POST /api/characters/[id]/inventory
```

with this body:

```json
{
  "action": "assignStarterEquipment"
}
```

the server creates one `ActivityLog` record for that character.

The log uses:

- `type`: `starter_equipment_assigned`
- `title`: `Starter Equipment Assigned`
- `description`: `The first tools of the road were gathered.`

The log details store:

- `characterName`
- `characterClass`
- `itemCount`
- `itemNames`

This log is connected to the same character that receives the starter equipment. It is only created when starter equipment assignment succeeds.

If the character already has items and the inventory API returns `409`, no `starter_equipment_assigned` log is created.

### Item Equipped

When a logged-in user equips one of their own character's equippable items through:

```text
PATCH /api/characters/[id]/inventory/[itemId]
```

with this body:

```json
{
  "action": "equip"
}
```

the server creates one `ActivityLog` record for that character.

The log uses:

- `type`: `item_equipped`
- `title`: `Item Equipped`
- `description`: `A tool was made ready for the road ahead.`

The log details store:

- `characterName`
- `itemName`
- `itemType`
- `itemSlot`

The log is only created when the item changes from unequipped to equipped.

No `item_equipped` log is created for invalid slots, same-slot conflicts, missing items, unauthorized requests, or an item that is already equipped.

### Item Unequipped

When a logged-in user unequips one of their own character's items through:

```text
PATCH /api/characters/[id]/inventory/[itemId]
```

with this body:

```json
{
  "action": "unequip"
}
```

the server creates one `ActivityLog` record for that character.

The log uses:

- `type`: `item_unequipped`
- `title`: `Item Unequipped`
- `description`: `A tool was returned to the pack.`

The log details store:

- `characterName`
- `itemName`
- `itemType`
- `itemSlot`

The log is only created when the item changes from equipped to unequipped.

No `item_unequipped` log is created for missing items, unauthorized requests, or an item that is already unequipped.

## Activity Log UI Summary

The protected character detail page now displays read-only activity logs:

```text
/characters/[id]
```

The page uses:

```text
GET /api/characters/[id]/activity-logs
```

The Activity Log section shows:

- `title`
- `type`
- `description`
- `createdAt`
- a readable `details` preview when details exist

If no logs exist, the page shows:

```text
No recorded activity yet.
```

The UI does not include an activity log form and does not directly write logs.

When the character detail page equips or unequips an item through the inventory API, it refreshes this section so `item_equipped` and `item_unequipped` logs appear after successful actions.

## Relation To Character

Each `ActivityLog` belongs to one `Character`.

`Character` has:

```prisma
activityLogs ActivityLog[]
```

The relation uses `onDelete: Cascade`, so deleting a character deletes that character's activity logs.

## Intended Future Log Types

Future log types may include:

- `character_created`
- `starter_equipment_assigned`
- `item_equipped`
- `item_unequipped`
- `rest_completed`
- `travel_completed`
- `quest_progress`
- `combat_result`
- `story_progress`

These strings are examples only. The project should add real log types gradually as systems are built.

## Future Event Examples

Future activity logs may record:

- A character entering Zakzum.
- Starter equipment being assigned.
- A rest reducing stress or restoring stamina.
- Travel from one location to another.
- Quest progress or failure.
- Combat results.
- Story chapter progress.

## Current Limitations

- A protected activity log read API route exists, but no write routes exist yet.
- A read-only activity log UI exists on `/characters/[id]`.
- Character creation now writes one automatic `character_created` activity log.
- Starter equipment assignment now writes one automatic `starter_equipment_assigned` activity log when assignment succeeds.
- Item equip now writes one automatic `item_equipped` activity log when equipment changes.
- Item unequip now writes one automatic `item_unequipped` activity log when equipment changes.
- No equip or unequip logs are written for no-op, conflict, invalid slot, not found, or unauthorized requests.
- Resting has not been added.
- Travel and map systems have not been added.
- Quests have not been added.
- Combat has not been added.
- Story systems have not been added.

## Next Recommended Step

Add the next deliberate automatic log source only when its owning server-side system exists. Rest, travel, quests, combat, and story systems have not been added yet.
