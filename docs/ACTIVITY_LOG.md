# Zakzum Online Activity Log Foundation

The Activity Log is the living memory of a character.

It should eventually record what the character does, survives, loses, earns, and changes. In Zakzum, progress should feel like a record of the road, not just numbers changing behind the screen.

## Current Status

The database foundation now exists through the `ActivityLog` Prisma model.

The protected read API route now exists for logged-in users to read activity logs for their own characters.

The protected character detail page now displays a read-only Activity Log section.

Public activity log write routes have not been added yet.

Automatic log sources now exist for character creation and starter equipment assignment.

Automatic log sources also exist for successful item equip, item unequip, travel, and rest actions.

Quest acceptance, objective completion, and quest completion now write automatic activity logs. No automatic logs are written yet during combat or story progress.

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

### Travel Completed

When a logged-in user moves one of their own characters through:

```text
POST /api/characters/[id]/travel
```

with this body:

```json
{
  "destinationLocationKey": "golden-citadel"
}
```

the server updates the character's `currentLocation` and creates one `ActivityLog` record for that character.

The log uses:

- `type`: `travel_completed`
- `title`: `Travel Completed`
- `description`: `The road carried another step into memory.`

The log details store:

- `characterName`
- `fromLocationKey`
- `fromLocationName`
- `destinationLocationKey`
- `destinationLocationName`
- `destinationRealmKey`
- `destinationRealmName`
- `staminaCost`
- `stressGain`
- `staminaBefore`
- `staminaAfter`
- `stressBefore`
- `stressAfter`

The log is only created when travel succeeds.

No `travel_completed` log is created for missing destinations, invalid destinations, same-location travel, insufficient stamina, missing characters, unauthorized requests, or failed requests.

### Rest Completed

When a logged-in user rests one of their own characters through:

```text
POST /api/characters/[id]/rest
```

the server updates the character's stamina and stress, then creates one `ActivityLog` record for that character.

The log uses:

- `type`: `rest_completed`
- `title`: `Rest Completed`
- `description`: `A pause from the road steadied body and mind.`

The log details store:

- `characterName`
- `locationKey`
- `staminaBefore`
- `staminaAfter`
- `maxStamina`
- `stressBefore`
- `stressAfter`
- `staminaRecovered`
- `stressReduced`

The log is only created when rest succeeds.

No `rest_completed` log is created when the character is already at full stamina and `0` stress, when rest values are invalid, when the character is missing, when the request is unauthorized, or when the request fails.

### Quest Accepted

When a logged-in user accepts an available static quest for an owned character through:

```text
POST /api/characters/[id]/quests
```

the server creates one `CharacterQuest` row and one `ActivityLog` record in the same transaction.

The log uses:

- `type`: `quest_accepted`
- `title`: `Quest Accepted`
- `description`: `A new duty was written into the road ahead.`

The log details store:

- `characterName`
- `questKey`
- `questTitle`
- `questType`
- `startLocationKey`
- `currentLocationKey`
- `status`

No `quest_accepted` log is created for invalid keys, unavailable locations, duplicate acceptance, missing characters, unauthorized requests, or failed transactions.

### Quest Completed

When a logged-in user completes an accepted quest for an owned character through:

```text
POST /api/characters/[id]/quests/[questKey]/complete
```

the server updates `CharacterQuest` and creates one ActivityLog record in the same transaction.

The log uses:

- `type`: `quest_completed`
- `title`: `Quest Completed`
- `description`: `A duty was fulfilled and written into memory.`

The log details store:

- `characterName`
- `questKey`
- `questTitle`
- `questType`
- `startLocationKey`
- `previousStatus`
- `status`
- `acceptedAt`
- `completedAt`
- `rewards`
- `goldAwarded`
- `experienceAwarded`
- `renownAwarded`
- `characterGoldBefore`
- `characterGoldAfter`
- `characterExperienceBefore`
- `characterExperienceAfter`
- `characterRenownBefore`
- `characterRenownAfter`

The reward details are written in the same transaction as quest completion and character progression updates. No `quest_completed` log or reward is created for invalid, unaccepted, completed, failed, missing, unauthorized, conflicting, or failed requests.

### Objective Completed

When a logged-in user completes a valid objective for an accepted quest belonging to an owned character through:

```text
POST /api/characters/[id]/quests/[questKey]/objectives/[objectiveKey]/complete
```

the server creates or updates one `CharacterQuestObjective` and creates one ActivityLog in the same transaction.

The log uses:

- `type`: `objective_completed`
- `title`: `Objective Completed`
- `description`: `A step of the duty was marked as fulfilled.`

The log details store:

- `characterName`
- `questKey`
- `questTitle`
- `questType`
- `objectiveKey`
- `objectiveText`
- `isRequired`
- `status`
- `completedAt`

The log is created only when the objective newly becomes completed. Repeated or concurrent duplicate completion returns the existing progress without creating another `objective_completed` log.

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

When the Quest section accepts a quest, it refreshes this section so the new `quest_accepted` log appears without a full page reload.

When the Quest page completes a quest, it checks the Activity Log endpoint after refreshing progress. The dedicated Activity page shows the new `quest_completed` entry when opened or refreshed.

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
- Travel now writes one automatic `travel_completed` activity log with stamina and stress cost details when a protected travel request succeeds.
- No travel logs are written for invalid, same-location, insufficient stamina, not found, unauthorized, or failed requests.
- Rest now writes one automatic `rest_completed` activity log with stamina and stress recovery details when a protected rest request succeeds.
- No rest logs are written for full-recovery, invalid, not found, unauthorized, or failed requests.
- Quest acceptance writes one automatic `quest_accepted` log when acceptance succeeds.
- No quest acceptance logs are written for invalid, unavailable, duplicate, not found, unauthorized, or failed requests.
- Quest completion writes one automatic `quest_completed` log when an accepted quest becomes completed.
- No quest completion logs are written for invalid, unaccepted, completed, failed, not found, unauthorized, conflicting, or failed requests.
- Objective completion writes one automatic `objective_completed` log when a valid objective for an accepted quest newly becomes completed.
- No duplicate objective logs are written for repeated or concurrent completion requests.
- Travel UI and map systems have not been added.
- Quest failure logs have not been added.
- Combat has not been added.
- Story systems have not been added.

## Next Recommended Step

Add the next deliberate automatic log source only when its owning server-side system exists. Quests, combat, and story systems have not been added yet.
