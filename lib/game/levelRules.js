export const LEVEL_THRESHOLDS = Object.freeze({
  1: 0,
  2: 100,
  3: 250,
  4: 450,
  5: 700,
  6: 1000,
  7: 1400,
  8: 1900,
  9: 2500,
  10: 3200,
});

const LEVELS = Object.keys(LEVEL_THRESHOLDS)
  .map(Number)
  .sort((a, b) => a - b);
const MIN_LEVEL = LEVELS[0];
const MAX_LEVEL = LEVELS[LEVELS.length - 1];

function isValidExperience(experience) {
  return (
    typeof experience === "number" &&
    Number.isFinite(experience) &&
    experience >= 0
  );
}

function isValidLevel(level) {
  return (
    Number.isInteger(level) &&
    level >= MIN_LEVEL &&
    level <= MAX_LEVEL &&
    LEVEL_THRESHOLDS[level] !== undefined
  );
}

function getThresholdForLevel(level) {
  return isValidLevel(level) ? LEVEL_THRESHOLDS[level] : null;
}

export function getLevelForExperience(experience) {
  if (!isValidExperience(experience)) {
    return null;
  }

  return LEVELS.reduce((highestLevel, level) => {
    if (experience >= LEVEL_THRESHOLDS[level]) {
      return level;
    }

    return highestLevel;
  }, MIN_LEVEL);
}

export function getNextLevelThreshold(currentLevel) {
  if (!isValidLevel(currentLevel)) {
    return null;
  }

  const nextLevel = currentLevel + 1;

  return getThresholdForLevel(nextLevel);
}

export function getExperienceProgress({ level, experience } = {}) {
  const currentLevelThreshold = getThresholdForLevel(level);

  if (currentLevelThreshold === null || !isValidExperience(experience)) {
    return {
      level: isValidLevel(level) ? level : null,
      experience: isValidExperience(experience) ? experience : null,
      currentLevelThreshold: null,
      nextLevel: null,
      nextLevelThreshold: null,
      experienceIntoLevel: null,
      experienceNeededForNextLevel: null,
      progressPercent: null,
    };
  }

  const nextLevel = level < MAX_LEVEL ? level + 1 : null;
  const nextLevelThreshold =
    nextLevel === null ? null : LEVEL_THRESHOLDS[nextLevel];
  const experienceIntoLevel = Math.max(
    0,
    experience - currentLevelThreshold,
  );
  const experienceNeededForNextLevel =
    nextLevelThreshold === null
      ? null
      : Math.max(0, nextLevelThreshold - experience);
  const progressPercent =
    nextLevelThreshold === null
      ? 100
      : Math.max(
          0,
          Math.min(
            100,
            Math.floor(
              ((experience - currentLevelThreshold) /
                (nextLevelThreshold - currentLevelThreshold)) *
                100,
            ),
          ),
        );

  return {
    level,
    experience,
    currentLevelThreshold,
    nextLevel,
    nextLevelThreshold,
    experienceIntoLevel,
    experienceNeededForNextLevel,
    progressPercent,
  };
}

export function canLevelUp({ level, experience } = {}) {
  if (!isValidLevel(level) || !isValidExperience(experience)) {
    return false;
  }

  return getLevelForExperience(experience) > level;
}

export function getLevelUpValidationError(input) {
  if (!input || typeof input !== "object") {
    return "Character level data is required.";
  }

  const { level, experience } = input;

  if (!isValidLevel(level)) {
    return "Character level is invalid.";
  }

  if (!isValidExperience(experience)) {
    return "Character experience is invalid.";
  }

  if (!canLevelUp({ level, experience })) {
    return "Not enough experience is available to level up.";
  }

  return null;
}

export function getLevelUpResult(input) {
  const validationError = getLevelUpValidationError(input);
  const { level, experience } = input || {};
  const newLevel = validationError
    ? isValidLevel(level)
      ? level
      : null
    : getLevelForExperience(experience);
  const currentLevel = isValidLevel(level) ? level : null;

  return {
    currentLevel,
    newLevel,
    levelsGained:
      currentLevel !== null && newLevel !== null
        ? Math.max(0, newLevel - currentLevel)
        : 0,
    experience: isValidExperience(experience) ? experience : null,
    canLevelUp: validationError === null,
    validationError,
  };
}
