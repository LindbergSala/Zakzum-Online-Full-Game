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

Only `ACCEPTED` progress can be completed, and every required objective for the quest must already be completed through objective progress. Optional objectives do not block completion.

If required objectives are incomplete, the route returns a safe rejection and does not update `CharacterQuest`, set `completedAt`, apply rewards, or create a `quest_completed` ActivityLog.

Successful completion updates the existing row to `COMPLETED`, sets `completedAt`, increments the character's validated gold, experience, and renown rewards, applies level progression when the updated experience reaches a higher threshold, and creates one `quest_completed` ActivityLog in the same transaction. The conditional database update prevents concurrent or repeated requests from creating duplicate completion logs, rewards, or level gains.

The response contains safe character identity, safe quest progress, static quest details, normalized rewards, objective summary, the character's updated gold, experience, renown, and level, plus safe level progression details. It does not return user data, raw quest rows, raw objective rows, or ActivityLog records.

## Completion UI

Accepted quests can now be completed from the protected Quest page:

```text
/characters/[id]/quests
```

The `Complete Quest` control calls `POST /api/characters/[id]/quests/[questKey]/complete`. The UI now mirrors the API rule: accepted quests keep `Complete Quest` disabled until required objectives are complete. A short guidance message tells the player to finish required objectives first.

After success, the page shows the awarded gold, experience, and renown with updated progression totals, reloads quest progress, and checks the Activity Log endpoint. The dedicated Activity page displays the new `quest_completed` entry when opened or refreshed.

Completed quests show their persisted status, `completedAt` date, and read-only reward summary instead of completion controls. Failed quests show their failed status and `failedAt` date. Duplicate completion is therefore unavailable through the UI and remains protected by the API transaction.

Static quests define modest gold, experience, and renown rewards. Completion validates and applies them atomically. Experience rewards can now raise `Character.level` after successful objective-gated completion. No stat increases or `maxStamina` increases are applied yet.

Objective normalization and completion-check helpers now exist in `lib/game/questObjectiveRules.js`. The protected completion API reads completed `CharacterQuestObjective` rows and requires every required objective key to be complete before completion.

### Activity Log

Successful completion writes:

- `type`: `quest_completed`
- `title`: `Quest Completed`
- `description`: `A duty was fulfilled and written into memory.`

The details store `characterName`, `questKey`, `questTitle`, `questType`, `startLocationKey`, `previousStatus`, `status`, `acceptedAt`, `completedAt`, normalized rewards, awarded values, before/after gold, experience, and renown values, level progression details, completed objective keys, required-objective completion state, and objective summary.

## Current Rule

Only a quest with persisted `ACCEPTED` progress and complete required objectives can be completed.

- `AVAILABLE` quests must be accepted first.
- `COMPLETED` quests cannot be completed again.
- `FAILED` quests cannot be completed.
- Required static objectives must have completed `CharacterQuestObjective` rows.
- Optional objectives do not block completion.
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

- Required objective completion is enforced by the completion API.
- The Quest UI disables `Complete Quest` while required objectives are incomplete.
- Character location is not checked yet.
- Static gold, experience, and renown rewards are applied during completion.
- Experience rewards can update `Character.level` after a valid completion.
- Rejected objective-gated completion attempts do not apply rewards or create `quest_completed` logs.
- Duplicate completion does not grant extra experience or extra levels.
- No separate level-up API or UI exists yet.
- No stat or `maxStamina` increases are applied yet.
- No item rewards are defined or calculated.
- A protected quest completion API exists.
- Quest completion controls exist for accepted quests.
- No database writes or ActivityLog records are created by these helpers.
- Combat, shops, map UI, and story progression are not connected.

## Next Recommended Step

Add safe level progress feedback in the UI. Keep item rewards and stat increases for separate later steps.
