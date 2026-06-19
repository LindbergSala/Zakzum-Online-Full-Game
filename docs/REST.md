# Zakzum Online Rest Foundation

The rest foundation prepares Zakzum Online for future recovery after travel pressure.

Rest is now available as a protected server-side action. It reuses the rest rules foundation to recover stamina, reduce stress, and record the recovery in the character's Activity Log.

## Source File

Rest rules live in:

```text
lib/game/restRules.js
```

## Exported Constants

`lib/game/restRules.js` exports:

- `BASE_REST_STAMINA_RECOVERY`
- `BASE_REST_STRESS_REDUCTION`

Current values:

- `BASE_REST_STAMINA_RECOVERY`: `3`
- `BASE_REST_STRESS_REDUCTION`: `2`

These values are intentionally small and simple for the first version.

## Exported Helpers

`lib/game/restRules.js` exports:

- `getRestResult({ stamina, maxStamina, stress })`
- `canRest({ stamina, maxStamina, stress })`
- `getRestValidationError({ stamina, maxStamina, stress })`

## Stamina Recovery

`getRestResult(...)` calculates a future stamina value from the current stamina and `BASE_REST_STAMINA_RECOVERY`.

Rest can never raise stamina above `maxStamina`.

The result includes:

- `staminaBefore`
- `staminaAfter`
- `maxStamina`
- `staminaRecovered`

## Stress Reduction

`getRestResult(...)` also calculates a future stress value from the current stress and `BASE_REST_STRESS_REDUCTION`.

Rest can never reduce stress below `0`.

The result includes:

- `stressBefore`
- `stressAfter`
- `stressReduced`

## Validation Behavior

`getRestResult(...)` returns `null` when stamina, max stamina, or stress values are not valid numbers.

`canRest(...)` returns `true` when at least one of these is true:

- stamina is below max stamina
- stress is above `0`

`canRest(...)` returns `false` when stamina is already full and stress is already `0`.

`getRestValidationError(...)` returns:

- a safe message when rest values are invalid
- a safe message when there is nothing to recover
- `null` when rest is valid

## Rest API Summary

The protected rest route is:

```text
POST /api/characters/[id]/rest
```

The route requires a valid logged-in user.

The route checks that the requested character exists and belongs to the logged-in user. If the character does not exist or belongs to another user, the route returns `404`.

Successful rest:

- increases `Character.stamina`
- caps stamina at `maxStamina`
- reduces `Character.stress`
- floors stress at `0`
- creates one `rest_completed` ActivityLog record

Rest is rejected when the character is already at full stamina and `0` stress.

Safe response shape:

```json
{
  "message": "Rest completed.",
  "character": {
    "id": "character_id",
    "name": "Mara",
    "currentLocation": "kingstone",
    "stamina": 8,
    "maxStamina": 10,
    "stress": 1
  },
  "restResult": {
    "staminaBefore": 5,
    "staminaAfter": 8,
    "maxStamina": 10,
    "stressBefore": 3,
    "stressAfter": 1,
    "staminaRecovered": 3,
    "stressReduced": 2
  }
}
```

The response does not include user data, `passwordHash`, raw session tokens, or ActivityLog records.

## Activity Log Behavior

Successful rest creates one automatic ActivityLog record.

The log uses:

- `type`: `rest_completed`
- `title`: `Rest Completed`
- `description`: `A pause from the road steadied body and mind.`

The log details store:

- `characterName`
- `locationKey`
- `staminaBefore`
- `staminaAfter`
- `maxStamina`
- `stressBefore`
- `stressAfter`
- `staminaRecovered`
- `stressReduced`

No `rest_completed` log is created when rest is rejected or the request fails.

## Current Limitations

- No rest UI exists yet.
- No random encounters exist yet.
- No dangerous-rest logic exists yet.
- No inn, camp, or shop logic exists yet.
- No quests, combat, map UI, or story systems exist yet.

## Next Recommended Step

Add a simple protected Rest UI on `/characters/[id]` that calls the rest API, updates stamina and stress, and refreshes the Activity Log after successful rest.
