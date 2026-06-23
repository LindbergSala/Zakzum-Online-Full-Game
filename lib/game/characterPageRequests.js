async function readJsonResponse(response, fallbackMessage) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }

  return data;
}

export async function fetchCharacterInventory(characterId) {
  const response = await fetch(`/api/characters/${characterId}/inventory`);

  return readJsonResponse(response, "Inventory could not be loaded.");
}

export async function requestStarterEquipmentAssignment(characterId) {
  const response = await fetch(`/api/characters/${characterId}/inventory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "assignStarterEquipment",
    }),
  });

  return {
    response,
    data: await response.json(),
  };
}

export async function requestCharacterEquipmentAction(
  characterId,
  itemId,
  action,
) {
  const response = await fetch(`/api/characters/${characterId}/inventory/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });

  return {
    response,
    data: await response.json(),
  };
}

export async function fetchCharacterQuests(characterId) {
  const response = await fetch(`/api/characters/${characterId}/quests`);

  return readJsonResponse(response, "Quests could not be loaded.");
}

export async function acceptCharacterQuest(characterId, questKey) {
  const response = await fetch(`/api/characters/${characterId}/quests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ questKey }),
  });

  return readJsonResponse(response, "The quest could not be accepted.");
}

export async function completeCharacterQuest(characterId, questKey) {
  const response = await fetch(
    `/api/characters/${characterId}/quests/${questKey}/complete`,
    {
      method: "POST",
    },
  );

  return readJsonResponse(response, "The quest could not be completed.");
}

export async function completeCharacterQuestObjective(
  characterId,
  questKey,
  objectiveKey,
) {
  const response = await fetch(
    `/api/characters/${characterId}/quests/${encodeURIComponent(
      questKey,
    )}/objectives/${encodeURIComponent(objectiveKey)}/complete`,
    {
      method: "POST",
    },
  );

  return readJsonResponse(response, "The objective could not be completed.");
}

export async function fetchCharacterActivityLogs(characterId) {
  const response = await fetch(`/api/characters/${characterId}/activity-logs`);

  return readJsonResponse(response, "Activity log could not be loaded.");
}

export async function travelCharacter(characterId, destinationLocationKey) {
  const response = await fetch(`/api/characters/${characterId}/travel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ destinationLocationKey }),
  });

  return readJsonResponse(response, "Travel could not be completed.");
}

export async function restCharacter(characterId) {
  const response = await fetch(`/api/characters/${characterId}/rest`, {
    method: "POST",
  });

  return readJsonResponse(response, "Rest could not be completed.");
}
