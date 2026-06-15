# Zakzum Online Activity Log Foundation

The Activity Log is the living memory of a character.

It should eventually record what the character does, survives, loses, earns, and changes. In Zakzum, progress should feel like a record of the road, not just numbers changing behind the screen.

## Current Status

The database foundation now exists through the `ActivityLog` Prisma model.

Activity log API routes and activity log UI have not been added yet.

No automatic logs are written yet during character creation, starter equipment assignment, rest, travel, combat, quests, or story progress.

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

- No activity log API routes exist yet.
- No activity log UI exists yet.
- No automatic activity logs are written yet.
- Character creation does not write activity logs yet.
- Starter equipment assignment does not write activity logs yet.
- Resting has not been added.
- Travel and map systems have not been added.
- Quests have not been added.
- Combat has not been added.
- Story systems have not been added.

## Next Recommended Step

Add protected activity log API routes for reading logs owned by the logged-in user's character. Automatic log creation should wait until each source system is built deliberately.
