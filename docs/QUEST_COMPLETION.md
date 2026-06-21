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

Only `ACCEPTED` progress can be completed. Successful completion updates the existing row to `COMPLETED`, sets `completedAt`, increments the character's validated gold, experience, and renown rewards, and creates one `quest_completed` ActivityLog in the same transaction. The conditional database update prevents concurrent or repeated requests from creating duplicate completion logs or applying rewards twice.

The response contains safe character identity, safe quest progress, static quest details, normalized rewards, and the character's updated gold, experience, and renown. It does not return user data or ActivityLog records.

## Completion UI

Accepted quests can now be completed from the protected Quest page:

```text
/characters/[id]/quests
```

The `Complete Quest` control calls `POST /api/characters/[id]/quests/[questKey]/complete`. After success, the page shows the awarded gold, experience, and renown with updated progression totals, reloads quest progress, and checks the Activity Log endpoint. The dedicated Activity page displays the new `quest_completed` entry when opened or refreshed.

Completed quests show their persisted status, `completedAt` date, and read-only reward summary instead of completion controls. Failed quests show their failed status and `failedAt` date. Duplicate completion is therefore unavailable through the UI and remains protected by the API transaction.

Static quests define modest gold, experience, and renown rewards. Completion validates and applies them atomically. Character level remains unchanged because level-up logic has not been added.

### Activity Log

Successful completion writes:

- `type`: `quest_completed`
- `title`: `Quest Completed`
- `description`: `A duty was fulfilled and written into memory.`

The details store `characterName`, `questKey`, `questTitle`, `questType`, `startLocationKey`, `previousStatus`, `status`, `acceptedAt`, `completedAt`, normalized rewards, awarded values, and before/after gold, experience, and renown values.

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
- Static gold, experience, and renown rewards are applied during completion.
- No level-up logic exists and completion does not modify character level.
- No item rewards are defined or calculated.
- A protected quest completion API exists.
- Quest completion controls exist for accepted quests.
- No database writes or ActivityLog records are created by these helpers.
- Combat, shops, map UI, and story progression are not connected.

## Next Recommended Step

Add objective completion rules without changing reward safety. Keep item rewards and level-up behavior for separate later steps.
