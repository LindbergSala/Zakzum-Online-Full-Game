# Zakzum Online Quest Completion Rules

The quest completion rules foundation provides shared validation for future protected quest completion behavior. It is intentionally small and does not write to the database.

## Exports

`lib/game/questCompletionRules.js` exports:

- `canCompleteQuest({ quest, progress, character })`
- `getQuestCompletionValidationError({ quest, progress, character })`
- `getQuestCompletionSummary({ quest, progress, character })`

The helpers accept character context for future rules, but the first version does not inspect character state.

## Completion API

The protected completion route is:

```text
POST /api/characters/[id]/quests/[questKey]/complete
```

The route requires a valid session and verifies that the character belongs to the logged-in user. It validates the static quest key, loads the matching `CharacterQuest` row, and reuses the completion rules.

Only `ACCEPTED` progress can be completed. Successful completion updates the existing row to `COMPLETED`, sets `completedAt`, and creates one `quest_completed` ActivityLog in the same transaction. The conditional database update prevents concurrent or repeated requests from creating duplicate completion logs.

The response contains safe character identity, safe quest progress, and static quest details. It does not return user data or ActivityLog records.

### Activity Log

Successful completion writes:

- `type`: `quest_completed`
- `title`: `Quest Completed`
- `description`: `A duty was fulfilled and written into memory.`

The details store `characterName`, `questKey`, `questTitle`, `questType`, `startLocationKey`, `previousStatus`, `status`, `acceptedAt`, and `completedAt`.

## Current Rule

Only a quest with persisted `ACCEPTED` progress can be completed.

- `AVAILABLE` quests must be accepted first.
- `COMPLETED` quests cannot be completed again.
- `FAILED` quests cannot be completed.
- Missing quest or progress data fails safely.
- Unknown progress statuses fail safely.

`getQuestCompletionSummary(...)` returns only:

```text
questKey
questTitle
currentStatus
canComplete
validationError
```

## Current Limitations

- Objective completion is not checked yet.
- Character location is not checked yet.
- Quest rewards do not exist yet.
- No gold, experience, renown, or item rewards are calculated.
- A protected quest completion API exists.
- No quest completion UI exists yet.
- No database writes or ActivityLog records are created by these helpers.
- Combat, shops, map UI, and story progression are not connected.

## Next Recommended Step

Add safe quest completion controls to the Quest UI. Keep rewards and objective tracking for separate later steps.
