import { useEffect, useState } from "react";
import CharacterPageLayout from "../../../lib/game/characterPageLayout";
import {
  formatDate,
  getQuestStatusLabel,
} from "../../../lib/game/characterPageHelpers";
import {
  acceptCharacterQuest,
  completeCharacterQuest,
  completeCharacterQuestObjective,
  fetchCharacterActivityLogs,
  fetchCharacterQuests,
} from "../../../lib/game/characterPageRequests";
import { getCharacterPageServerSideProps } from "../../../lib/game/characterPageServer";
import {
  getQuestRewards,
  getQuestRewardSummary,
} from "../../../lib/game/questRewardRules";

function formatRewards(rewards) {
  return `${rewards.gold} gold, ${rewards.experience} experience, and ${rewards.renown} renown`;
}

function formatCharacterProgress(progress) {
  if (!progress) {
    return "";
  }

  const levelText =
    typeof progress.level === "number" ? `, level ${progress.level}` : "";

  return ` Current totals: ${progress.gold} gold, ${progress.experience} experience, ${progress.renown} renown${levelText}.`;
}

function formatLevelProgression(levelProgression) {
  if (!levelProgression) {
    return "";
  }

  if (levelProgression.leveledUp) {
    return ` Level increased from ${levelProgression.levelBefore} to ${levelProgression.levelAfter}.`;
  }

  if (levelProgression.nextLevel !== null) {
    return ` Level remains ${levelProgression.levelAfter}. ${levelProgression.experienceNeededForNextLevel} experience needed for level ${levelProgression.nextLevel}.`;
  }

  return ` Level remains ${levelProgression.levelAfter}. Current level table complete.`;
}

function QuestRewardPreview({ quest }) {
  const rewardSummary = getQuestRewardSummary(quest);
  const isCompleted = quest.progress?.status === "COMPLETED";

  return (
    <div className="quest-reward-summary">
      <p className="item-meta">
        {isCompleted ? "Rewards Earned" : "Rewards"}
      </p>
      {rewardSummary.hasRewards ? (
        <dl className="quest-reward-grid">
          <div>
            <dt>Gold</dt>
            <dd>{rewardSummary.gold}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{rewardSummary.experience}</dd>
          </div>
          <div>
            <dt>Renown</dt>
            <dd>{rewardSummary.renown}</dd>
          </div>
        </dl>
      ) : (
        <p className="supporting-text">No progression rewards are listed.</p>
      )}
    </div>
  );
}

function getFallbackObjectiveProgress(quest) {
  if (!Array.isArray(quest.objectives)) {
    return [];
  }

  return quest.objectives.map((objective, index) => ({
    key: `read-only-objective-${index + 1}`,
    text: objective,
    isRequired: true,
    isCompleted: false,
    completedAt: null,
    isReadOnlyFallback: true,
  }));
}

function getQuestObjectiveProgressState(quest) {
  const objectiveProgress = Array.isArray(quest.objectiveProgress)
    ? quest.objectiveProgress
    : getFallbackObjectiveProgress(quest);
  const summary = quest.objectiveSummary;
  const requiredObjectives = objectiveProgress.filter(
    (objective) => objective.isRequired,
  );
  const completedObjectives = objectiveProgress.filter(
    (objective) => objective.isCompleted,
  );
  const completedRequiredObjectives = requiredObjectives.filter(
    (objective) => objective.isCompleted,
  );
  const objectiveCount =
    typeof summary?.objectiveCount === "number"
      ? summary.objectiveCount
      : objectiveProgress.length;
  const requiredObjectiveCount =
    typeof summary?.requiredObjectiveCount === "number"
      ? summary.requiredObjectiveCount
      : requiredObjectives.length;
  const completedObjectiveCount =
    typeof summary?.completedObjectiveCount === "number"
      ? summary.completedObjectiveCount
      : completedObjectives.length;
  const completedRequiredObjectiveCount =
    typeof summary?.completedRequiredObjectiveCount === "number"
      ? summary.completedRequiredObjectiveCount
      : completedRequiredObjectives.length;
  const areRequiredObjectivesComplete =
    typeof summary?.areRequiredObjectivesComplete === "boolean"
      ? summary.areRequiredObjectivesComplete
      : completedRequiredObjectiveCount >= requiredObjectiveCount;

  return {
    objectiveProgress,
    objectiveCount,
    requiredObjectiveCount,
    completedObjectiveCount,
    completedRequiredObjectiveCount,
    areRequiredObjectivesComplete,
  };
}

function QuestObjectiveProgress({
  completingObjectiveKey,
  onCompleteObjective,
  quest,
}) {
  const questStatus = quest.progress?.status || "AVAILABLE";
  const objectiveState = getQuestObjectiveProgressState(quest);
  const objectiveProgress = objectiveState.objectiveProgress;
  const canCompleteObjectives = questStatus === "ACCEPTED";

  return (
    <div className="quest-objective-summary">
      <p className="item-meta">Objectives</p>
      {objectiveState.objectiveCount > 0 ? (
        <p className="supporting-text">
          Required objectives: {objectiveState.completedRequiredObjectiveCount} /{" "}
          {objectiveState.requiredObjectiveCount} complete. Total objectives:{" "}
          {objectiveState.completedObjectiveCount} /{" "}
          {objectiveState.objectiveCount} complete.
        </p>
      ) : null}

      {objectiveProgress.length > 0 ? (
        <ul className="quest-objective-list">
          {objectiveProgress.map((objective) => {
            const completionKey = `${quest.key}:${objective.key}`;
            const canCompleteObjective =
              canCompleteObjectives &&
              !objective.isCompleted &&
              !objective.isReadOnlyFallback;

            return (
              <li className="quest-objective-item" key={objective.key}>
                <div className="quest-objective-content">
                  <p className="supporting-text">{objective.text}</p>
                  <p className="item-meta">
                    {objective.isRequired ? "Required" : "Optional"} /{" "}
                    {objective.isCompleted ? "Complete" : "Incomplete"}
                  </p>
                  {objective.completedAt ? (
                    <p className="item-meta">
                      Completed {formatDate(objective.completedAt)}
                    </p>
                  ) : null}
                </div>

                {canCompleteObjective ? (
                  <button
                    className="secondary-button small-action-button"
                    disabled={completingObjectiveKey === completionKey}
                    onClick={() => onCompleteObjective(quest, objective)}
                    type="button"
                  >
                    {completingObjectiveKey === completionKey
                      ? "Completing..."
                      : "Complete Objective"}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="supporting-text">No quest objectives are listed yet.</p>
      )}
    </div>
  );
}

function QuestActions({
  acceptingQuestKey,
  completingQuestKey,
  onAcceptQuest,
  onCompleteQuest,
  quest,
}) {
  const status = quest.progress?.status || "AVAILABLE";
  const objectiveState = getQuestObjectiveProgressState(quest);
  const canCompleteQuest =
    status === "ACCEPTED" && objectiveState.areRequiredObjectivesComplete;

  if (status === "AVAILABLE") {
    return (
      <button
        className="secondary-button small-action-button"
        disabled={acceptingQuestKey === quest.key}
        onClick={() => onAcceptQuest(quest)}
        type="button"
      >
        {acceptingQuestKey === quest.key ? "Accepting..." : "Accept Quest"}
      </button>
    );
  }

  if (status === "ACCEPTED") {
    return (
      <div>
        <p className="item-action-note">{getQuestStatusLabel(status)}</p>
        {quest.progress.acceptedAt ? (
          <p className="item-meta">
            Accepted {formatDate(quest.progress.acceptedAt)}
          </p>
        ) : null}
        {!canCompleteQuest ? (
          <p className="supporting-text">
            Complete all required objectives before finishing this quest.
          </p>
        ) : null}
        <button
          className="secondary-button small-action-button"
          disabled={completingQuestKey === quest.key || !canCompleteQuest}
          onClick={() => onCompleteQuest(quest)}
          type="button"
        >
          {completingQuestKey === quest.key
            ? "Completing..."
            : "Complete Quest"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="item-action-note">{getQuestStatusLabel(status)}</p>
      {status === "COMPLETED" && quest.progress.completedAt ? (
        <p className="item-meta">
          Completed {formatDate(quest.progress.completedAt)}
        </p>
      ) : null}
      {status === "FAILED" && quest.progress.failedAt ? (
        <p className="item-meta">
          Failed {formatDate(quest.progress.failedAt)}
        </p>
      ) : null}
    </div>
  );
}

export default function CharacterQuestsPage({ character }) {
  const [quests, setQuests] = useState([]);
  const [questsLoading, setQuestsLoading] = useState(true);
  const [questsError, setQuestsError] = useState("");
  const [acceptingQuestKey, setAcceptingQuestKey] = useState("");
  const [questAcceptError, setQuestAcceptError] = useState("");
  const [questAcceptSuccess, setQuestAcceptSuccess] = useState("");
  const [completingQuestKey, setCompletingQuestKey] = useState("");
  const [questCompleteError, setQuestCompleteError] = useState("");
  const [questCompleteSuccess, setQuestCompleteSuccess] = useState("");
  const [completingObjectiveKey, setCompletingObjectiveKey] = useState("");
  const [objectiveCompleteError, setObjectiveCompleteError] = useState("");
  const [objectiveCompleteSuccess, setObjectiveCompleteSuccess] = useState("");
  const [questLocationName, setQuestLocationName] = useState("");
  const [questRealmName, setQuestRealmName] = useState("");

  async function loadQuests() {
    setQuestsLoading(true);
    setQuestsError("");

    try {
      const data = await fetchCharacterQuests(character.id);

      setQuests(data.quests || []);
      setQuestLocationName(
        data.character?.currentLocationName ||
          data.character?.currentLocation ||
          "Unknown location",
      );
      setQuestRealmName(
        data.character?.currentRealmName ||
          data.character?.currentRealmKey ||
          "Unknown realm",
      );
    } catch (error) {
      setQuestsError(error.message || "Quests could not be loaded.");
      setQuests([]);
    } finally {
      setQuestsLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    async function loadInitialQuests() {
      setQuestsLoading(true);
      setQuestsError("");

      try {
        const data = await fetchCharacterQuests(character.id);

        if (!isActive) {
          return;
        }

        setQuests(data.quests || []);
        setQuestLocationName(
          data.character?.currentLocationName ||
            data.character?.currentLocation ||
            "Unknown location",
        );
        setQuestRealmName(
          data.character?.currentRealmName ||
            data.character?.currentRealmKey ||
            "Unknown realm",
        );
      } catch (error) {
        if (isActive) {
          setQuestsError(error.message || "Quests could not be loaded.");
          setQuests([]);
        }
      } finally {
        if (isActive) {
          setQuestsLoading(false);
        }
      }
    }

    loadInitialQuests();

    return () => {
      isActive = false;
    };
  }, [character.id]);

  async function handleAcceptQuest(quest) {
    setAcceptingQuestKey(quest.key);
    setQuestAcceptError("");
    setQuestAcceptSuccess("");
    setQuestCompleteError("");
    setQuestCompleteSuccess("");
    setObjectiveCompleteError("");
    setObjectiveCompleteSuccess("");

    try {
      await acceptCharacterQuest(character.id, quest.key);
      setQuestAcceptSuccess(`${quest.title} has been accepted.`);
      await loadQuests();
    } catch (error) {
      setQuestAcceptError(error.message || "The quest could not be accepted.");
    } finally {
      setAcceptingQuestKey("");
    }
  }

  async function handleCompleteQuest(quest) {
    setCompletingQuestKey(quest.key);
    setQuestCompleteError("");
    setQuestCompleteSuccess("");
    setQuestAcceptError("");
    setQuestAcceptSuccess("");
    setObjectiveCompleteError("");
    setObjectiveCompleteSuccess("");

    try {
      const data = await completeCharacterQuest(character.id, quest.key);
      const rewards = getQuestRewards({
        rewards: data.rewards || quest.rewards,
      });
      const progressMessage = formatCharacterProgress(data.characterProgress);
      const levelProgressMessage = formatLevelProgression(
        data.levelProgression,
      );

      setQuestCompleteSuccess(
        `${quest.title} has been completed. Awarded ${formatRewards(rewards)}.${progressMessage}${levelProgressMessage}`,
      );
      await loadQuests();

      try {
        await fetchCharacterActivityLogs(character.id);
      } catch {
        // The dedicated Activity page retries the log request when opened.
      }
    } catch (error) {
      setQuestCompleteError(error.message || "The quest could not be completed.");
    } finally {
      setCompletingQuestKey("");
    }
  }

  async function handleCompleteObjective(quest, objective) {
    const completionKey = `${quest.key}:${objective.key}`;

    setCompletingObjectiveKey(completionKey);
    setObjectiveCompleteError("");
    setObjectiveCompleteSuccess("");
    setQuestAcceptError("");
    setQuestAcceptSuccess("");
    setQuestCompleteError("");
    setQuestCompleteSuccess("");

    try {
      await completeCharacterQuestObjective(
        character.id,
        quest.key,
        objective.key,
      );
      setObjectiveCompleteSuccess(`${objective.text} has been completed.`);
      await loadQuests();
    } catch (error) {
      setObjectiveCompleteError(
        error.message || "The objective could not be completed.",
      );
    } finally {
      setCompletingObjectiveKey("");
    }
  }

  return (
    <CharacterPageLayout
      character={character}
      description="Quest browsing, objective progress, and quest outcomes now live on their own page instead of sharing space with every other system."
      pageTitle="Quests"
    >
      <section className="session-panel" aria-labelledby="quests-title">
        <h2 id="quests-title">Quests</h2>
        <p className="supporting-text">
          Local duties wait where the road leaves unfinished work behind.
        </p>
        <dl className="sheet-grid">
          <div>
            <dt>Current Quest Location</dt>
            <dd>{questLocationName || "Unknown location"}</dd>
          </div>
          <div>
            <dt>Realm</dt>
            <dd>{questRealmName || "Unknown realm"}</dd>
          </div>
        </dl>

        {questsLoading ? (
          <p className="supporting-text">Reading the local notices...</p>
        ) : null}
        {questsError ? <p className="form-message error">{questsError}</p> : null}
        {questAcceptError ? (
          <p className="form-message error">{questAcceptError}</p>
        ) : null}
        {questAcceptSuccess ? (
          <p className="form-message success">{questAcceptSuccess}</p>
        ) : null}
        {questCompleteError ? (
          <p className="form-message error">{questCompleteError}</p>
        ) : null}
        {questCompleteSuccess ? (
          <p className="form-message success">{questCompleteSuccess}</p>
        ) : null}
        {objectiveCompleteError ? (
          <p className="form-message error">{objectiveCompleteError}</p>
        ) : null}
        {objectiveCompleteSuccess ? (
          <p className="form-message success">{objectiveCompleteSuccess}</p>
        ) : null}

        {!questsLoading && !questsError && quests.length === 0 ? (
          <p className="empty-state">No local quests are available here yet.</p>
        ) : null}

        {!questsLoading && !questsError && quests.length > 0 ? (
          <div className="inventory-list">
            {quests.map((quest) => (
              <article className="inventory-item" key={quest.key}>
                <div>
                  <h3>{quest.title}</h3>
                  <p className="item-meta">
                    {quest.type} / Suggested level {quest.suggestedLevel}
                  </p>
                </div>

                {quest.isStarterQuest ? (
                  <p className="item-action-note">Starter Quest</p>
                ) : null}

                <p className="supporting-text">{quest.shortDescription}</p>

                <div>
                  <p className="item-meta">Briefing</p>
                  <p className="supporting-text">{quest.briefing}</p>
                </div>

                <QuestObjectiveProgress
                  completingObjectiveKey={completingObjectiveKey}
                  onCompleteObjective={handleCompleteObjective}
                  quest={quest}
                />

                <QuestRewardPreview quest={quest} />

                <div className="inventory-item-actions">
                  <QuestActions
                    acceptingQuestKey={acceptingQuestKey}
                    completingQuestKey={completingQuestKey}
                    onAcceptQuest={handleAcceptQuest}
                    onCompleteQuest={handleCompleteQuest}
                    quest={quest}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </CharacterPageLayout>
  );
}

export const getServerSideProps = getCharacterPageServerSideProps;
