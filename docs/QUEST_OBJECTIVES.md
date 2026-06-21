# Zakzum Online Quest Objective Rules

The quest objective rules foundation gives static quest objectives one safe, reusable shape for future progress tracking and objective-aware completion. Objectives remain concise and text-based.

## Current Objective Data

Current quests store objectives as explicit objects:

```js
objectives: [
  {
    key: "read-kingstone-road-notice",
    text: "Read the road notice posted in Kingstone.",
    isRequired: true,
  },
]
```

Every current objective has a readable kebab-case key tied to its meaning. These keys prepare future persisted progress and should not be renamed casually once persistence exists.

The rules continue to support legacy string objectives, but static quest data no longer relies on generated index keys.

## Normalized Shape

Each normalized objective contains:

```text
key
text
isRequired
```

Object objectives retain their non-empty explicit key. Missing object keys and legacy string objectives fall back to index-based keys for compatibility, and missing `isRequired` values default to `true`.

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

Existing quest API responses continue to expose objectives as text-only arrays for UI compatibility. Explicit keys remain part of static quest data and the objective rules foundation until persisted progress is introduced.

## Current Limitations

- Objectives are static quest data only.
- Current static objectives use explicit stable keys, but the rules retain index-key fallback compatibility.
- Objective progress is not stored in PostgreSQL.
- The completion API still permits an accepted quest to complete without objective checks.
- No objective checkboxes, buttons, or progress controls exist.
- No ActivityLog records are written by these helpers.
- Reward application and quest completion behavior are unchanged.
- Combat, shops, map UI, and story progression are not connected.

## Next Recommended Step

Add a small objective persistence model keyed by the explicit objective keys before enforcing objective completion in the API.
