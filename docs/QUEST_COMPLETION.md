# Zakzum Online Quest Completion Rules

The quest completion rules foundation provides shared validation for future protected quest completion behavior. It is intentionally small and does not write to the database.

## Exports

`lib/game/questCompletionRules.js` exports:

- `canCompleteQuest({ quest, progress, character })`
- `getQuestCompletionValidationError({ quest, progress, character })`
- `getQuestCompletionSummary({ quest, progress, character })`

The helpers accept character context for future rules, but the first version does not inspect character state.

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
- No quest completion API exists yet.
- No quest completion UI exists yet.
- No database writes or ActivityLog records are created by these helpers.
- Combat, shops, map UI, and story progression are not connected.

## Next Recommended Step

Add a protected quest completion API that reuses these rules and updates `CharacterQuest` atomically. Keep rewards and objective tracking for separate later steps.
