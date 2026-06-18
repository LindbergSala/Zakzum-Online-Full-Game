# Zakzum Online Travel Foundation

The travel foundation prepares Zakzum Online for movement between canon locations.

The project now has reusable travel validation helpers, reusable travel cost helpers, a protected API route, and a simple protected character detail UI section that can move a logged-in user's own character between valid location keys.

This foundation does not create a map, trigger encounters, add travel danger rolls, or add a rest system.

## Source File

Travel rules live in:

```text
lib/game/travelRules.js
```

The rules reuse world location data from:

```text
lib/game/worldLocations.js
```

Travel cost rules live in:

```text
lib/game/travelCostRules.js
```

## Travel Cost Rules

The travel cost rules foundation defines the first reusable stamina and stress calculations for future travel.

`lib/game/travelCostRules.js` exports:

- `BASE_TRAVEL_STAMINA_COST`
- `BASE_TRAVEL_STRESS_GAIN`
- `SAME_REALM_STAMINA_COST`
- `DIFFERENT_REALM_STAMINA_COST`
- `DANGEROUS_LOCATION_STRESS_GAIN`
- `getTravelCost({ currentLocationKey, destinationLocationKey })`
- `hasEnoughStaminaForTravel({ stamina, travelCost })`
- `getTravelCostValidationError({ stamina, travelCost })`

Current values:

- `BASE_TRAVEL_STAMINA_COST`: `1`
- `BASE_TRAVEL_STRESS_GAIN`: `1`
- `SAME_REALM_STAMINA_COST`: `1`
- `DIFFERENT_REALM_STAMINA_COST`: `2`
- `DANGEROUS_LOCATION_STRESS_GAIN`: `2`

Same-realm travel uses `SAME_REALM_STAMINA_COST`.

Different-realm travel uses `DIFFERENT_REALM_STAMINA_COST`.

Normal destinations use `BASE_TRAVEL_STRESS_GAIN`.

Dangerous destination types use `DANGEROUS_LOCATION_STRESS_GAIN`.

Dangerous destination types are currently:

- `dungeon`
- `wilderness`
- `realm`

`getTravelCost(...)` returns `null` when either location key is invalid.

For valid location keys, it returns:

- `staminaCost`
- `stressGain`
- `isSameRealm`
- `fromLocationKey`
- `fromLocationName`
- `destinationLocationKey`
- `destinationLocationName`
- `destinationRealmKey`
- `destinationRealmName`

`hasEnoughStaminaForTravel(...)` returns `true` only when the character has at least the calculated stamina cost.

`getTravelCostValidationError(...)` returns a safe message for invalid costs or insufficient stamina, and returns `null` when the cost is usable.

The protected travel API now applies these costs when travel succeeds.

The Travel UI does not display these costs yet.

## Travel API

The protected travel route is:

```text
POST /api/characters/[id]/travel
```

The route requires a valid logged-in user.

The route checks that the requested character exists and belongs to the logged-in user. If the character does not exist or belongs to another user, the route returns `404`.

Request body:

```json
{
  "destinationLocationKey": "golden-citadel"
}
```

If `destinationLocationKey` is missing, the route returns `400`.

If the destination is invalid or matches the character's current location, the route returns `400` with a safe validation message.

Successful travel updates `Character.currentLocation` to the destination location key.

Successful travel also reduces `Character.stamina` by the calculated `staminaCost` and increases `Character.stress` by the calculated `stressGain`.

If the character does not have enough stamina, the route returns `400`, leaves `currentLocation`, `stamina`, and `stress` unchanged, and does not create a `travel_completed` log.

Safe response shape:

```json
{
  "message": "Travel completed.",
  "character": {
    "id": "character_id",
    "name": "Character Name",
    "currentLocation": "golden-citadel",
    "currentLocationName": "Golden Citadel",
    "stamina": 9,
    "maxStamina": 10,
    "stress": 1
  },
  "travelCost": {
    "staminaCost": 1,
    "stressGain": 1,
    "isSameRealm": true,
    "fromLocationKey": "kingstone",
    "fromLocationName": "Kingstone",
    "destinationLocationKey": "golden-citadel",
    "destinationLocationName": "Golden Citadel",
    "destinationRealmKey": "heartlands",
    "destinationRealmName": "Heartlands"
  },
  "destination": {
    "key": "golden-citadel",
    "name": "Golden Citadel",
    "realmKey": "heartlands",
    "realmName": "Heartlands",
    "type": "stronghold",
    "shortDescription": "A seat of old authority bound to the prophecy of the Empty Throne."
  }
}
```

The response does not include user data, `passwordHash`, raw session tokens, or activity logs.

## Travel UI

The protected character detail page now has a simple Travel section:

```text
/characters/[id]
```

The UI shows:

- the current location friendly name
- the current realm name
- a destination selector
- a destination preview
- a Travel button
- simple loading, success, and error states

The destination selector uses `getAvailableTravelDestinations(...)`, so the character's current location is not listed as a destination.

When travel succeeds, the UI updates the displayed current location and refreshes the Activity Log so the new `travel_completed` log appears.

The Travel section does not include a map, displayed costs, distance, danger, random encounters, or rest controls yet.

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

Same-location travel is rejected because a character must move to a different location key.

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

## Activity Log Behavior

Successful travel creates one automatic `ActivityLog` record.

The log uses:

- `type`: `travel_completed`
- `title`: `Travel Completed`
- `description`: `The road carried another step into memory.`

The log details store:

- `characterName`
- `fromLocationKey`
- `fromLocationName`
- `destinationLocationKey`
- `destinationLocationName`
- `destinationRealmKey`
- `destinationRealmName`
- `staminaCost`
- `stressGain`
- `staminaBefore`
- `staminaAfter`
- `stressBefore`
- `stressAfter`

No travel log is created for missing destinations, invalid destinations, same-location travel, insufficient stamina, missing characters, unauthorized requests, or failed requests.

## Current Limitations

- No map UI exists yet.
- No travel distance exists yet.
- Travel UI does not display travel costs yet.
- Travel now consumes stamina and increases stress, but no rest system exists yet.
- No random encounters exist yet.
- No dangerous-road logic exists yet.
- No coordinates or adjacency graph exists yet.
- No quests, combat, resting, shops, or story systems exist yet.

## Next Recommended Step

Update the Travel UI to show stamina cost and stress gain before travel. After that, add a small rest foundation so characters can recover from travel pressure.
