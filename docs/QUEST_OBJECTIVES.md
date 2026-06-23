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

Completed objective keys are persisted through the model foundation and included in protected quest reads. The Quest UI can mark objectives complete for accepted quests. The quest completion API still does not require objective completion.

Existing quest API responses continue to expose `objectives` as text-only arrays for UI compatibility. Explicit keys also appear in the separate safe `objectiveProgress` field.

## Objective Persistence

The `CharacterQuestObjective` Prisma model stores per-objective progress for a `CharacterQuest`. It contains the static `objectiveKey` reference, completion state, optional completion time, and record timestamps.

`objectiveKey` refers by convention to an explicit objective key in `lib/game/questData.js`. Objective text and objective order remain in static quest data and are not duplicated in PostgreSQL. No `Quest` or static `QuestObjective` table exists.

Each `CharacterQuest` has an `objectives` relation. The unique `characterQuestId` and `objectiveKey` constraint allows only one progress row per objective for that accepted quest. Deleting a `CharacterQuest` cascades to its objective rows; deleting a character cascades through `CharacterQuest` as well.

## Objective Progress API

The protected objective completion route is:

```text
POST /api/characters/[id]/quests/[questKey]/objectives/[objectiveKey]/complete
```

The route requires a valid session and verifies character ownership. Both `questKey` and `objectiveKey` are validated against static quest data. Only objectives belonging to an accepted `CharacterQuest` can be completed; completed and failed quests return `409`.

The route creates a completed `CharacterQuestObjective` when no row exists or updates an incomplete row. Repeating a completed objective returns safe current data without creating another row or log. The unique constraint and guarded transaction protect concurrent duplicate requests.

When an objective newly becomes complete, the same transaction creates one `objective_completed` ActivityLog. The log stores character and quest identity, objective key and text, required state, completed status, and completion time.

The Quest UI uses this route for accepted quests. Quest completion does not enforce objective completion.

## Objective Progress Reads

The protected quest read route now includes objective progress:

```text
GET /api/characters/[id]/quests
```

Each returned quest keeps its existing text-only `objectives` array and adds `objectiveProgress`. Every progress item contains the static objective `key`, `text`, and `isRequired` values plus safe `isCompleted` and `completedAt` values merged from `CharacterQuestObjective`.

Quests without a `CharacterQuest` row return every objective as incomplete. Persisted rows are matched by stable `objectiveKey`; raw `CharacterQuest` and `CharacterQuestObjective` records are not returned.

An `objectiveSummary` also reports total, required, completed, and completed-required counts, plus whether all required objectives are complete. This summary is informational only and does not change completion eligibility.

## Objective Progress UI

The protected Quest page displays objective progress for each returned quest:

```text
/characters/[id]/quests
```

Quest cards show objective text, required or optional state, complete or incomplete state, completion time when available, and a small objective summary. Available, completed, and failed quests show objectives as read-only.

Accepted quests show a `Complete Objective` button for incomplete objectives. The button calls:

```text
POST /api/characters/[id]/quests/[questKey]/objectives/[objectiveKey]/complete
```

After a successful objective completion, the Quest page refreshes quest data so the completed objective state and timestamp are shown. Duplicate objective completion is avoided in the UI because completed objectives no longer show the button; the API remains the server-side protection.

No objective rewards exist, and no schema changes are required for the UI.

## Current Limitations

- Objective definitions remain static quest data, while a database model now exists for future per-character progress.
- Current static objectives use explicit stable keys, but the rules retain index-key fallback compatibility.
- A protected API can mark valid objectives complete, and protected quest reads expose safe merged progress. No reset API exists.
- The completion API still permits an accepted quest to complete without objective checks.
- The Quest UI can complete objectives for accepted quests, but it does not enforce objectives before `Complete Quest`.
- No ActivityLog records are written by these helpers.
- Reward application and quest completion behavior are unchanged.
- Combat, shops, map UI, and story progression are not connected.

## Next Recommended Step

Verify objective progress controls in the browser, then enforce required objective completion in a separate quest completion API change once that flow is proven.
