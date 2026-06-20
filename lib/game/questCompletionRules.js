export function getQuestCompletionValidationError({ quest, progress } = {}) {
  if (!quest) {
    return "Quest is required.";
  }

  if (!progress) {
    return "Quest progress is required.";
  }

  switch (progress.status) {
    case "ACCEPTED":
      return null;
    case "AVAILABLE":
      return "The quest must be accepted before it can be completed.";
    case "COMPLETED":
      return "This quest has already been completed.";
    case "FAILED":
      return "A failed quest cannot be completed.";
    default:
      return "Quest progress status cannot be completed.";
  }
}

export function canCompleteQuest(input) {
  return getQuestCompletionValidationError(input) === null;
}

export function getQuestCompletionSummary(input = {}) {
  const { quest, progress } = input;
  const validationError = getQuestCompletionValidationError(input);

  return {
    questKey: typeof quest?.key === "string" ? quest.key : null,
    questTitle: typeof quest?.title === "string" ? quest.title : null,
    currentStatus:
      typeof progress?.status === "string" ? progress.status : null,
    canComplete: validationError === null,
    validationError,
  };
}
