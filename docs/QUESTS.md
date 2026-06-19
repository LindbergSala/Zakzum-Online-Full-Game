# Zakzum Online Quest Data Foundation

The quest data foundation gives future quest APIs, UI, persistence, and activity logging one shared set of grounded quest definitions.

The source file is:

```text
lib/game/questData.js
```

This foundation is static JavaScript. It does not create database records or player quest progress.

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

The protected read-only quest route is:

```text
GET /api/characters/[id]/quests
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
      ]
    }
  ]
}
```

The route does not return user data, `passwordHash`, raw session tokens, ActivityLog records, rewards, or mutable quest progress.

Only `GET` is supported. No public quest write behavior exists.

## Quest UI Summary

The protected character detail page now includes a read-only Quest section:

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

The UI includes safe loading, error, and empty states. It does not include accept or complete controls.

## Current Limitations

- The quest API is read-only and returns static definitions only.
- The Quest UI is read-only.
- No quest database models exist yet.
- No player quest status is persisted yet.
- No objective completion logic exists yet.
- No quest rewards exist yet.
- No item, gold, experience, or renown rewards exist yet.
- No quest combat exists yet.
- No story progression is connected to quests yet.

## Next Recommended Step

Add a quest persistence model foundation before introducing acceptance or completion behavior. Keep rewards and combat for separate later steps.
