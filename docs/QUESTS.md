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

## Current Limitations

- No quest API exists yet.
- No quest UI exists yet.
- No quest database models exist yet.
- No player quest status is persisted yet.
- No objective completion logic exists yet.
- No quest rewards exist yet.
- No item, gold, experience, or renown rewards exist yet.
- No quest combat exists yet.
- No story progression is connected to quests yet.

## Next Recommended Step

Add a protected read-only quest API that lists static quests for the logged-in character's current location. Keep acceptance, progress, completion, rewards, and combat for separate later steps.
