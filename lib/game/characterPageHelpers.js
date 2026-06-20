import { getLocationByKey } from "./worldLocations";

export function formatDate(dateValue) {
  if (typeof dateValue !== "string") {
    return "";
  }

  return dateValue.split("T")[0];
}

export function getLocationDisplayName(locationKey) {
  return getLocationByKey(locationKey)?.name || locationKey;
}

export function formatDetails(details) {
  if (!details) {
    return "";
  }

  if (typeof details === "string") {
    return details;
  }

  const displayDetails = {
    ...details,
    ...(typeof details.currentLocation === "string"
      ? { currentLocation: getLocationDisplayName(details.currentLocation) }
      : {}),
    ...(typeof details.currentLocationKey === "string"
      ? {
          currentLocationKey: getLocationDisplayName(
            details.currentLocationKey,
          ),
        }
      : {}),
    ...(typeof details.startLocationKey === "string"
      ? { startLocationKey: getLocationDisplayName(details.startLocationKey) }
      : {}),
  };

  return JSON.stringify(displayDetails, null, 2);
}

export function getQuestStatusLabel(status) {
  switch (status) {
    case "ACCEPTED":
      return "Accepted";
    case "COMPLETED":
      return "Completed";
    case "FAILED":
      return "Failed";
    default:
      return "Available";
  }
}

export function getCharacterPageLinks(characterId) {
  return [
    {
      label: "Overview",
      href: `/characters/${characterId}`,
      description: "Read the current record and open the smaller character pages.",
    },
    {
      label: "Journey",
      href: `/characters/${characterId}/journey`,
      description: "Test travel and rest without scrolling past inventory and quests.",
    },
    {
      label: "Quests",
      href: `/characters/${characterId}/quests`,
      description: "Review local duties and accept available quests from one page.",
    },
    {
      label: "Inventory",
      href: `/characters/${characterId}/inventory`,
      description: "Manage equipped gear, saved items, and starter equipment in one place.",
    },
    {
      label: "Activity",
      href: `/characters/${characterId}/activity`,
      description: "Read the activity log without loading the rest of the character sheet.",
    },
  ];
}