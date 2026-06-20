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
objectives
```

Quest and location keys use stable lowercase kebab-case values.

`startLocationKey` must match a location in `lib/game/worldLocations.js`.

`objectives` contains text-only guidance. Objective completion logic does not exist yet.

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
      "objectives": [
        "Read the road notice posted in Kingstone."
      ],
      "progress": {
        "status": "AVAILABLE",
        "acceptedAt": null,
        "completedAt": null,
        "failedAt": null
      }
    }
  ]
}
```

Each quest returned by `GET` includes a safe `progress` object. Quests without a `CharacterQuest` row use the virtual status `AVAILABLE` with null timestamps. Quests with persisted progress expose their `ACCEPTED`, `COMPLETED`, or `FAILED` status and the relevant acceptance, completion, and failure timestamps.

The route only reads progress rows whose `questKey` appears in the static quest list for the character's current location. Raw `CharacterQuest` rows and internal relation data are not returned.

The `POST` request accepts:

```json
{
  "questKey": "warnings-on-the-old-road"
}
```

Acceptance requires a valid static quest key, an owned character, and a quest available at the character's current location. A successful request creates one `CharacterQuest` row with status `ACCEPTED` and returns `201` with safe character identity, persisted progress identity, and static quest details.

Accepting the same quest more than once returns `409`. Invalid keys and quests from another location return `400`. The progress row and its `quest_accepted` activity log are created in one transaction.

The route does not return user data, `passwordHash`, raw session tokens, ActivityLog records, or rewards.

No completion or failure behavior exists yet.

## Quest UI Summary

The protected character detail page now includes a Quest section:

```text
/characters/[id]
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
- a starter quest label when applicable

The Quest section refreshes after successful travel so the list follows the character's new current location.

The UI includes safe loading, error, empty, and acceptance feedback states. Quests with virtual `AVAILABLE` progress show an `Accept Quest` button that calls `POST /api/characters/[id]/quests`. After successful acceptance, the Quest section and Activity Log refresh.

Persisted quests show `Accepted`, `Completed`, or `Failed` instead of an acceptance button. Accepted quests also show `acceptedAt` when available. This prevents duplicate acceptance through the UI, while the API unique constraint remains the final server-side protection.

The UI does not include completion or failure controls.

## Quest Persistence

The `CharacterQuest` model stores quest progress for a character without duplicating static quest content. Its `questKey` refers by convention to a quest key in `lib/game/questData.js`; there is no database foreign key because static quest definitions are not database rows.

Persisted statuses use the `QuestProgressStatus` enum:

- `ACCEPTED`
- `COMPLETED`
- `FAILED`

Each row records acceptance time and optional completion or failure time. A unique constraint on `characterId` and `questKey` allows only one progress row for a given quest and character. Deleting a character cascades to its quest progress rows.

Quest titles, briefings, objectives, and rewards remain in static data and are not stored in `CharacterQuest`.

## Current Limitations

- The quest API lists static definitions and accepts available quests.
- Quest reads merge current-location static definitions with safe per-character progress.
- `AVAILABLE` is a virtual read status and is not stored in `QuestProgressStatus`.
- The Quest UI can accept available quests and display persisted status.
- The `CharacterQuest` persistence model stores accepted quest rows.
- A quest key references static quest data by convention rather than a database relation.
- No quest completion or failure API exists yet.
- No quest completion or failure controls exist in the UI.
- No objective completion logic exists yet.
- No objective progress fields exist yet.
- No quest rewards exist yet.
- No item, gold, experience, or renown rewards exist yet.
- No quest combat exists yet.
- No story progression is connected to quests yet.

## Next Recommended Step

Add a protected quest completion rules foundation before introducing completion controls or rewards. Keep rewards and combat for separate later steps.
