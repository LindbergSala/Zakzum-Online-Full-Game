import { getLocationByKey, getRealmByKey } from "./worldLocations.js";

export const BASE_TRAVEL_STAMINA_COST = 1;
export const BASE_TRAVEL_STRESS_GAIN = 1;
export const SAME_REALM_STAMINA_COST = BASE_TRAVEL_STAMINA_COST;
export const DIFFERENT_REALM_STAMINA_COST = 2;
export const DANGEROUS_LOCATION_STRESS_GAIN = 2;

const DANGEROUS_LOCATION_TYPES = ["dungeon", "wilderness", "realm"];

function getRealmName(realmKey) {
  return getRealmByKey(realmKey)?.name || realmKey;
}

export function getTravelCost({ currentLocationKey, destinationLocationKey }) {
  const currentLocation = getLocationByKey(currentLocationKey);
  const destinationLocation = getLocationByKey(destinationLocationKey);

  if (!currentLocation || !destinationLocation) {
    return null;
  }

  const isSameRealm = currentLocation.realmKey === destinationLocation.realmKey;
  const destinationIsDangerous = DANGEROUS_LOCATION_TYPES.includes(
    destinationLocation.type,
  );

  return {
    staminaCost: isSameRealm
      ? SAME_REALM_STAMINA_COST
      : DIFFERENT_REALM_STAMINA_COST,
    stressGain: destinationIsDangerous
      ? DANGEROUS_LOCATION_STRESS_GAIN
      : BASE_TRAVEL_STRESS_GAIN,
    isSameRealm,
    fromLocationKey: currentLocation.key,
    fromLocationName: currentLocation.name,
    destinationLocationKey: destinationLocation.key,
    destinationLocationName: destinationLocation.name,
    destinationRealmKey: destinationLocation.realmKey,
    destinationRealmName: getRealmName(destinationLocation.realmKey),
  };
}

export function hasEnoughStaminaForTravel({ stamina, travelCost }) {
  if (!travelCost) {
    return false;
  }

  return stamina >= travelCost.staminaCost;
}

export function getTravelCostValidationError({ stamina, travelCost }) {
  if (!travelCost) {
    return "Travel cost could not be calculated.";
  }

  if (!hasEnoughStaminaForTravel({ stamina, travelCost })) {
    return "Not enough stamina for travel.";
  }

  return null;
}
