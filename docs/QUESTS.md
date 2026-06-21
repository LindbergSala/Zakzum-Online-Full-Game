# Zakzum Online Quest Data Foundation

The quest data foundation gives future quest APIs, UI, persistence, and activity logging one shared set of grounded quest definitions.

The source file is:

```text
lib/game/questData.js
```

Quest content remains static JavaScript. Per-character quest status now has a separate persistence foundation.

## Exports

`lib/game/questData.js` exports:

- `QUEST_TYPES`
- `QUEST_STATUSES`
- `QUESTS`
- `getQuestByKey(questKey)`
- `getQuestsByLocation(locationKey)`
- `getAvailableQuestsForLocation(locationKey)`
- `isValidQuestKey(questKey)`
- `isValidQuestStatus(status)`

## Quest Data Shape

Each quest definition includes:

```text
key
title
type
startLocationKey
shortDescription
briefing
suggestedLevel
isStarterQuest
rewards
objectives
```

Quest and location keys use stable lowercase kebab-case values.

`startLocationKey` must match a location in `lib/game/worldLocations.js`.

`objectives` contains text-only guidance stored as objects with explicit kebab-case keys, text, and required-state metadata. `lib/game/questObjectiveRules.js` normalizes and validates this shape. Explicit keys should remain stable once objective persistence exists. Objective progress is not persisted or enforced yet.

`rewards` contains modest static `gold`, `experience`, and `renown` values. The completion API validates and applies these values atomically.

## Quest Types

Current quest type values are:

- `notice`
- `delivery`
- `investigation`
- `exploration`
- `recovery`
- `defense`

## Quest Statuses

Current quest status values are:

- `available`
- `accepted`
- `completed`
- `failed`

These status values prepare future player quest state. Static quest definitions do not store a mutable status.

## Starter Quest Set

The first quest set contains four low-level Heartlands duties:

- a Kingstone road-warning notice
- a Goldmere message delivery
- a Barrowfield investigation
- a Northwatch defense watch

The tasks focus on roads, warnings, graves, messages, and unfinished local duties. They do not introduce major prophecy progression or Lord of Crystals boss content.

## Helper Behavior

`getQuestByKey(...)` returns one matching quest or `null`.

`getQuestsByLocation(...)` returns quests whose `startLocationKey` matches a valid world location. Invalid location keys return an empty array.

`getAvailableQuestsForLocation(...)` currently returns the static quest definitions available at that location. Future player-specific accepted, completed, and failed state will belong to a separate persistence layer.

`isValidQuestKey(...)` and `isValidQuestStatus(...)` provide safe validation for future APIs.

## Quest API Summary

The protected quest route is:

```text
GET /api/characters/[id]/quests
POST /api/characters/[id]/quests
```

The route requires a valid logged-in user and verifies that the requested character belongs to that user. Missing characters and characters owned by another user return `404`.

The route reads `Character.currentLocation`, resolves friendly location and realm names through `lib/game/worldLocations.js`, and returns static quests from `getAvailableQuestsForLocation(...)`.

Safe response shape:

```json
{
  "character": {
    "id": "character_id",
    "name": "Mara",
    "currentLocation": "kingstone",
    "currentLocationName": "Kingstone",
    "currentRealmKey": "heartlands",
    "currentRealmName": "Heartlands"
  },
  "quests": [
    {
      "key": "warnings-on-the-old-road",
      "title": "Warnings on the Old Road",
      "type": "notice",
      "startLocationKey": "kingstone",
      "shortDescription": "Check the weathered warning posts along the first road beyond Kingstone.",
      "briefing": "Three warning posts have gone unread since the last hard rain.",
      "suggestedLevel": 1,
      "isStarterQuest": true,
      "rewards": {
        "gold": 5,
        "experience": 10,
        "renown": 1
      },
      "objectives": [
        "Read the road notice posted in Kingstone."
      ],
      "progress": {
        "status": "AVAILABLE",
        "acceptedAt": null,
        "completedAt": null,
        "failedAt": null
      },
      "objectiveProgress": [
        {
          "key": "read-kingstone-road-notice",
          "text": "Read the road notice posted in Kingstone.",
          "isRequired": true,
          "isCompleted": false,
          "completedAt": null
        }
      ],
      "objectiveSummary": {
        "objectiveCount": 3,
        "requiredObjectiveCount": 3,
        "completedObjectiveCount": 0,
        "completedRequiredObjectiveCount": 0,
        "areRequiredObjectivesComplete": false
      }
    }
  ]
}
```

Each quest returned by `GET` includes a safe `progress` object. Quests without a `CharacterQuest` row use the virtual status `AVAILABLE` with null timestamps. Quests with persisted progress expose their `ACCEPTED`, `COMPLETED`, or `FAILED` status and the relevant acceptance, completion, and failure timestamps.

Each quest also includes `objectiveProgress`, which merges normalized static objective identity and text with persisted `CharacterQuestObjective` completion state. Unaccepted quests expose all objectives as incomplete. The safe `objectiveSummary` reports objective totals and required-completion state without returning raw persistence rows. The existing text-only `objectives` array remains unchanged for UI compatibility.

The route only reads progress rows whose `questKey` appears in the static quest list for the character's current location. Raw `CharacterQuest` rows and internal relation data are not returned.

The `POST` request accepts:

```json
{
  "questKey": "warnings-on-the-old-road"
}
```

Acceptance requires a valid static quest key, an owned character, and a quest available at the character's current location. A successful request creates one `CharacterQuest` row with status `ACCEPTED` and returns `201` with safe character identity, persisted progress identity, and static quest details.

Accepting the same quest more than once returns `409`. Invalid keys and quests from another location return `400`. The progress row and its `quest_accepted` activity log are created in one transaction.

The route does not return user data, `passwordHash`, raw session tokens, or ActivityLog records. Static reward data is normalized to the safe `gold`, `experience`, and `renown` fields before it is returned.

Quest completion uses the separate protected completion route. Quest failure behavior does not exist yet.

## Quest UI Summary

The protected character detail page now includes a Quest section:

```text
/characters/[id]/quests
```

The UI calls:

```text
GET /api/characters/[id]/quests
```

It displays the character's friendly current location and realm names, then lists the static quests available for `Character.currentLocation`.

Each quest displays:

- title
- type
- suggested level
- short description
- briefing
- text-only objectives
- gold, experience, and renown reward preview
- a starter quest label when applicable

The Quest section refreshes after successful travel so the list follows the character's new current location.

The UI includes safe loading, error, empty, and acceptance feedback states. Quests with virtual `AVAILABLE` progress show an `Accept Quest` button that calls `POST /api/characters/[id]/quests`. After successful acceptance, the Quest section and Activity Log refresh.

Persisted quests show `Accepted`, `Completed`, or `Failed` instead of an acceptance button. Accepted quests also show `acceptedAt` when available. This prevents duplicate acceptance through the UI, while the API unique constraint remains the final server-side protection.

The UI includes completion controls for accepted quests but does not include failure controls. Quest cards display read-only reward previews, successful completion displays awarded values and updated progression totals, and completed quests retain their reward summary after refresh.

## Quest Persistence

The `CharacterQuest` model stores quest progress for a character without duplicating static quest content. Its `questKey` refers by convention to a quest key in `lib/game/questData.js`; there is no database foreign key because static quest definitions are not database rows.

`CharacterQuestObjective` now persists objective completion state. Its `objectiveKey` refers to explicit static objective keys by convention, while objective text and order remain in `lib/game/questData.js`. The protected completion API writes these rows, and protected quest reads expose safe merged objective progress. The UI does not display objective progress yet.

The protected objective completion API can create or update one valid objective progress row for an accepted quest. It validates ownership and static keys, writes one automatic log only for a new completion, and does not yet affect quest completion eligibility.

Persisted statuses use the `QuestProgressStatus` enum:

- `ACCEPTED`
- `COMPLETED`
- `FAILED`

Each row records acceptance time and optional completion or failure time. A unique constraint on `characterId` and `questKey` allows only one progress row for a given quest and character. Deleting a character cascades to its quest progress rows.

Quest titles, briefings, objectives, and rewards remain in static data and are not stored in `CharacterQuest`.

All current static quests include modest gold, experience, and renown definitions. `lib/game/questRewardRules.js` normalizes and validates this data. The completion API applies rewards atomically, and the Quest UI displays only the safe normalized values.

## Quest Completion Rules

Reusable completion validation now exists in `lib/game/questCompletionRules.js`. Only quests with `ACCEPTED` progress can pass the current rule. `AVAILABLE`, `COMPLETED`, `FAILED`, missing, and unknown progress states fail safely.

Reusable objective normalization and validation now exist in `lib/game/questObjectiveRules.js`. Current quest data uses explicit meaningful keys rather than index-generated keys. These helpers can compare required objectives with a temporary `completedObjectiveKeys` array, but the completion API and UI do not use that concept yet.

The rules are connected to the protected completion API at `POST /api/characters/[id]/quests/[questKey]/complete`. Successful completion updates `CharacterQuest`, applies rewards, and creates a `quest_completed` ActivityLog atomically.

The Quest UI now shows `Complete Quest` for accepted quests. Successful completion refreshes quest progress and checks the Activity Log endpoint. Completed quests show `Completed` and their completion date instead of action buttons.

Completion does not check objectives or location. It validates and applies static gold, experience, and renown rewards but does not perform level-up calculations.

## Current Limitations

- The quest API lists static definitions and accepts available quests.
- Quest reads merge current-location static definitions with safe per-character progress.
- `AVAILABLE` is a virtual read status and is not stored in `QuestProgressStatus`.
- The Quest UI can accept available quests and display persisted status.
- The `CharacterQuest` persistence model stores accepted quest rows.
- A quest key references static quest data by convention rather than a database relation.
- A protected quest completion API exists; no quest failure API exists yet.
- Quest completion controls exist for accepted quests; no quest failure controls exist.
- Completion rules are wired to both API and UI behavior.
- Objective completion can be persisted and read safely, but no objective UI exists yet.
- Quest completion does not enforce required objective completion yet.
- Static gold, experience, and renown rewards are applied during completion and shown read-only in the Quest UI.
- No item rewards exist yet.
- No separate reward claim flow or level-up logic exists.
- No quest combat exists yet.
- No story progression is connected to quests yet.

## Next Recommended Step

Add objective progress controls to the Quest UI before enforcing required objectives during quest completion. Keep item rewards, level-up logic, and combat for separate later steps.
