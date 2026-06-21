# Zakzum Online Quest Objective Rules

The quest objective rules foundation gives static quest objectives one safe, reusable shape for future progress tracking and objective-aware completion. Objectives remain concise and text-based.

## Current Objective Data

Current quests store objectives as strings:

```js
objectives: [
  "Read the road notice posted in Kingstone.",
  "Inspect the marked warning posts beyond the city.",
]
```

The rules also accept future object entries with `key`, `text`, and `isRequired` fields.

## Normalized Shape

Each normalized objective contains:

```text
key
text
isRequired
```

String objectives receive stable index-based keys such as `objective-1`. Object objectives retain a non-empty explicit key. Missing keys fall back to the same index-based form, and missing `isRequired` values default to `true`.

## Exports

`lib/game/questObjectiveRules.js` exports:

- `getQuestObjectives(quest)`
- `hasQuestObjectives(quest)`
- `getQuestObjectiveValidationError(quest)`
- `getQuestObjectiveSummary(quest)`
- `areQuestObjectivesComplete({ quest, completedObjectiveKeys })`

Validation rejects a missing quest, an objectives value that is present but is not an array, empty objective text, and duplicate normalized objective keys. A missing objectives property and an empty objectives array are valid.

`getQuestObjectiveSummary(...)` returns safe quest identity, objective counts, normalized objectives, an objective-presence flag, and the validation result.

## Completion Concept

`completedObjectiveKeys` is currently a simple array of normalized objective keys. `areQuestObjectivesComplete(...)` returns `true` only when every required objective key is present. Optional objectives do not block completion.

Completed objective keys are not persisted yet. The quest completion API does not read them or require objective completion, and no objective UI exists.

## Current Limitations

- Objectives are static quest data only.
- Objective progress is not stored in PostgreSQL.
- The completion API still permits an accepted quest to complete without objective checks.
- No objective checkboxes, buttons, or progress controls exist.
- No ActivityLog records are written by these helpers.
- Reward application and quest completion behavior are unchanged.
- Combat, shops, map UI, and story progression are not connected.

## Next Recommended Step

Add a small objective persistence model or an equally explicit persisted progress shape before enforcing objective completion in the API.
