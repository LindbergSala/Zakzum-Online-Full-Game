# Zakzum Online Rest Foundation

The rest foundation prepares Zakzum Online for future recovery after travel pressure.

Rest is not a live gameplay action yet. This step only defines reusable rules for how stamina recovery and stress reduction should be calculated later.

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

## Current Limitations

- No rest API route exists yet.
- No rest UI exists yet.
- Rest does not update `Character.stamina` yet.
- Rest does not update `Character.stress` yet.
- Rest does not create ActivityLog records yet.
- No random encounters exist yet.
- No dangerous-rest logic exists yet.
- No inn, camp, or shop logic exists yet.
- No quests, combat, map UI, or story systems exist yet.

## Next Recommended Step

Add a protected rest API route that reuses these rules, updates the logged-in user's own character, and creates one automatic rest activity log only when rest succeeds.
