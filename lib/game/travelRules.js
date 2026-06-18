import {
  LOCATIONS,
  getLocationByKey,
  getRealmByKey,
  isValidLocationKey,
} from "./worldLocations.js";

function toTravelDestinationSummary(locationEntry) {
  const realm = getRealmByKey(locationEntry.realmKey);

  return {
    key: locationEntry.key,
    name: locationEntry.name,
    realmKey: locationEntry.realmKey,
    realmName: realm?.name || locationEntry.realmKey,
    type: locationEntry.type,
    shortDescription: locationEntry.shortDescription,
  };
}

export function getTravelValidationError({
  currentLocationKey,
  destinationLocationKey,
}) {
  if (!isValidLocationKey(currentLocationKey)) {
    return "Current location is not valid.";
  }

  if (!isValidLocationKey(destinationLocationKey)) {
    return "Destination location is not valid.";
  }

  if (currentLocationKey === destinationLocationKey) {
    return "Destination must be different from the current location.";
  }

  return null;
}

export function canTravelToLocation({
  currentLocationKey,
  destinationLocationKey,
}) {
  return (
    getTravelValidationError({ currentLocationKey, destinationLocationKey }) ===
    null
  );
}

export function getAvailableTravelDestinations({ currentLocationKey }) {
  if (!isValidLocationKey(currentLocationKey)) {
    return [];
  }

  return LOCATIONS.filter(
    (locationEntry) => locationEntry.key !== currentLocationKey,
  ).map(toTravelDestinationSummary);
}

export function getTravelDestinationSummary(destinationLocationKey) {
  const locationEntry = getLocationByKey(destinationLocationKey);

  if (!locationEntry) {
    return null;
  }

  return toTravelDestinationSummary(locationEntry);
}
