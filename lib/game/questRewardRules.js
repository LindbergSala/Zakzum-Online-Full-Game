const REWARD_KEYS = ["gold", "experience", "renown"];

function normalizeRewardValue(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : 0;
}

export function getQuestRewards(quest) {
  return {
    gold: normalizeRewardValue(quest?.rewards?.gold),
    experience: normalizeRewardValue(quest?.rewards?.experience),
    renown: normalizeRewardValue(quest?.rewards?.renown),
  };
}

export function hasQuestRewards(quest) {
  const rewards = getQuestRewards(quest);

  return REWARD_KEYS.some((rewardKey) => rewards[rewardKey] > 0);
}

export function getQuestRewardValidationError(quest) {
  if (!quest) {
    return "Quest is required.";
  }

  for (const rewardKey of REWARD_KEYS) {
    const value = quest.rewards?.[rewardKey];

    if (value === undefined) {
      continue;
    }

    if (typeof value !== "number" || !Number.isFinite(value)) {
      return `Quest reward ${rewardKey} must be a finite number.`;
    }

    if (value < 0) {
      return `Quest reward ${rewardKey} cannot be negative.`;
    }
  }

  return null;
}

export function getQuestRewardSummary(quest) {
  const rewards = getQuestRewards(quest);
  const validationError = getQuestRewardValidationError(quest);

  return {
    questKey: typeof quest?.key === "string" ? quest.key : null,
    questTitle: typeof quest?.title === "string" ? quest.title : null,
    ...rewards,
    hasRewards: validationError === null && hasQuestRewards(quest),
    validationError,
  };
}
