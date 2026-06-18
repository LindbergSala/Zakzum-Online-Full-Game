# Zakzum Online Travel Foundation

The travel rules foundation prepares Zakzum Online for future movement between canon locations.

This step adds validation helpers only. It does not move characters, create a map, charge stamina, raise stress, trigger encounters, or write activity logs.

## Source File

Travel rules live in:

```text
lib/game/travelRules.js
```

The rules reuse world location data from:

```text
lib/game/worldLocations.js
```

## Exported Helpers

`lib/game/travelRules.js` exports:

- `canTravelToLocation({ currentLocationKey, destinationLocationKey })`
- `getTravelValidationError({ currentLocationKey, destinationLocationKey })`
- `getAvailableTravelDestinations({ currentLocationKey })`
- `getTravelDestinationSummary(destinationLocationKey)`

## Valid Destination Behavior

Travel is considered valid only when:

- `currentLocationKey` is a known location key
- `destinationLocationKey` is a known location key
- `destinationLocationKey` is different from `currentLocationKey`

For example, `kingstone` to another valid location key is allowed by the rules foundation.

## Invalid Destination Behavior

Invalid current or destination location keys are rejected.

`getTravelValidationError(...)` returns a short safe message when:

- the current location key is invalid
- the destination location key is invalid
- the destination is the same as the current location

It returns `null` when travel is valid.

## Available Destination Shape

`getAvailableTravelDestinations(...)` returns safe destination summaries with:

- `key`
- `name`
- `realmKey`
- `realmName`
- `type`
- `shortDescription`

The current location is excluded from the returned destination list.

## Destination Summary Shape

`getTravelDestinationSummary(destinationLocationKey)` returns `null` for invalid destination keys.

For valid destination keys, it returns:

- `key`
- `name`
- `realmKey`
- `realmName`
- `type`
- `shortDescription`

## Current Limitations

- No travel API exists yet.
- No travel UI exists yet.
- No map UI exists yet.
- Characters are not moved by gameplay yet.
- No travel distance exists yet.
- No travel cost exists yet.
- No stamina cost exists yet.
- No stress cost exists yet.
- No random encounters exist yet.
- No dangerous-road logic exists yet.
- No coordinates or adjacency graph exists yet.
- No quests, combat, resting, shops, or story systems exist yet.

## Next Recommended Step

Add a protected travel API only after the rules foundation remains stable. The first travel API should verify character ownership, validate the destination key, update `Character.currentLocation`, and write an activity log.
