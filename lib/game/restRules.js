export const BASE_REST_STAMINA_RECOVERY = 3;
export const BASE_REST_STRESS_REDUCTION = 2;

function hasValidRestValues({ stamina, maxStamina, stress }) {
  return (
    Number.isFinite(stamina) &&
    Number.isFinite(maxStamina) &&
    Number.isFinite(stress) &&
    stamina >= 0 &&
    maxStamina >= 0 &&
    stress >= 0 &&
    stamina <= maxStamina
  );
}

export function getRestResult({ stamina, maxStamina, stress }) {
  if (!hasValidRestValues({ stamina, maxStamina, stress })) {
    return null;
  }

  const staminaAfter = Math.min(
    maxStamina,
    stamina + BASE_REST_STAMINA_RECOVERY,
  );
  const stressAfter = Math.max(0, stress - BASE_REST_STRESS_REDUCTION);

  return {
    staminaBefore: stamina,
    staminaAfter,
    maxStamina,
    stressBefore: stress,
    stressAfter,
    staminaRecovered: staminaAfter - stamina,
    stressReduced: stress - stressAfter,
  };
}

export function canRest({ stamina, maxStamina, stress }) {
  if (!hasValidRestValues({ stamina, maxStamina, stress })) {
    return false;
  }

  return stamina < maxStamina || stress > 0;
}

export function getRestValidationError({ stamina, maxStamina, stress }) {
  if (!hasValidRestValues({ stamina, maxStamina, stress })) {
    return "Rest values are not valid.";
  }

  if (!canRest({ stamina, maxStamina, stress })) {
    return "There is nothing to recover.";
  }

  return null;
}
