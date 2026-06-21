function getObjectiveKey(objective, index) {
  if (typeof objective?.key === "string" && objective.key.trim()) {
    return objective.key.trim();
  }

  return `objective-${index + 1}`;
}

function normalizeObjective(objective, index) {
  if (typeof objective === "string") {
    return {
      key: `objective-${index + 1}`,
      text: objective.trim(),
      isRequired: true,
    };
  }

  return {
    key: getObjectiveKey(objective, index),
    text: typeof objective?.text === "string" ? objective.text.trim() : "",
    isRequired:
      typeof objective?.isRequired === "boolean"
        ? objective.isRequired
        : true,
  };
}

export function getQuestObjectives(quest) {
  if (!Array.isArray(quest?.objectives)) {
    return [];
  }

  return quest.objectives.map(normalizeObjective);
}

export function hasQuestObjectives(quest) {
  return getQuestObjectives(quest).length > 0;
}

export function getQuestObjectiveValidationError(quest) {
  if (!quest) {
    return "Quest is required.";
  }

  if (quest.objectives !== undefined && !Array.isArray(quest.objectives)) {
    return "Quest objectives must be an array.";
  }

  const objectives = getQuestObjectives(quest);
  const objectiveKeys = new Set();

  for (const objective of objectives) {
    if (!objective.text) {
      return `Quest objective ${objective.key} must include text.`;
    }

    if (objectiveKeys.has(objective.key)) {
      return `Quest objective key ${objective.key} must be unique.`;
    }

    objectiveKeys.add(objective.key);
  }

  return null;
}

export function getQuestObjectiveSummary(quest) {
  const objectives = getQuestObjectives(quest);
  const validationError = getQuestObjectiveValidationError(quest);

  return {
    questKey: typeof quest?.key === "string" ? quest.key : null,
    questTitle: typeof quest?.title === "string" ? quest.title : null,
    objectiveCount: objectives.length,
    requiredObjectiveCount: objectives.filter(
      (objective) => objective.isRequired,
    ).length,
    objectives,
    hasObjectives: objectives.length > 0,
    validationError,
  };
}

export function areQuestObjectivesComplete({
  quest,
  completedObjectiveKeys,
} = {}) {
  if (getQuestObjectiveValidationError(quest)) {
    return false;
  }

  const completedKeys = new Set(
    Array.isArray(completedObjectiveKeys) ? completedObjectiveKeys : [],
  );

  return getQuestObjectives(quest)
    .filter((objective) => objective.isRequired)
    .every((objective) => completedKeys.has(objective.key));
}
