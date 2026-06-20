import { useEffect, useState } from "react";
import CharacterPageLayout from "../../../lib/game/characterPageLayout";
import {
  formatDate,
  getQuestStatusLabel,
} from "../../../lib/game/characterPageHelpers";
import {
  acceptCharacterQuest,
  completeCharacterQuest,
  fetchCharacterActivityLogs,
  fetchCharacterQuests,
} from "../../../lib/game/characterPageRequests";
import { getCharacterPageServerSideProps } from "../../../lib/game/characterPageServer";

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

    try {
      await completeCharacterQuest(character.id, quest.key);
      setQuestCompleteSuccess(`${quest.title} has been completed.`);
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

  return (
    <CharacterPageLayout
      character={character}
      description="Quest browsing and quest acceptance now live on their own page instead of sharing space with every other system."
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

                {quest.objectives.length > 0 ? (
                  <div>
                    <p className="item-meta">Objectives</p>
                    <ul className="placeholder-list">
                      {quest.objectives.map((objective) => (
                        <li key={objective}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="inventory-item-actions">
                  {(quest.progress?.status || "AVAILABLE") === "AVAILABLE" ? (
                    <button
                      className="secondary-button small-action-button"
                      disabled={acceptingQuestKey === quest.key}
                      onClick={() => handleAcceptQuest(quest)}
                      type="button"
                    >
                      {acceptingQuestKey === quest.key
                        ? "Accepting..."
                        : "Accept Quest"}
                    </button>
                  ) : quest.progress.status === "ACCEPTED" ? (
                    <div>
                      <p className="item-action-note">
                        {getQuestStatusLabel(quest.progress.status)}
                      </p>
                      {quest.progress.acceptedAt ? (
                        <p className="item-meta">
                          Accepted {formatDate(quest.progress.acceptedAt)}
                        </p>
                      ) : null}
                      <button
                        className="secondary-button small-action-button"
                        disabled={completingQuestKey === quest.key}
                        onClick={() => handleCompleteQuest(quest)}
                        type="button"
                      >
                        {completingQuestKey === quest.key
                          ? "Completing..."
                          : "Complete Quest"}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="item-action-note">
                        {getQuestStatusLabel(quest.progress.status)}
                      </p>
                      {quest.progress.status === "COMPLETED" &&
                      quest.progress.completedAt ? (
                        <p className="item-meta">
                          Completed {formatDate(quest.progress.completedAt)}
                        </p>
                      ) : null}
                      {quest.progress.status === "FAILED" &&
                      quest.progress.failedAt ? (
                        <p className="item-meta">
                          Failed {formatDate(quest.progress.failedAt)}
                        </p>
                      ) : null}
                    </div>
                  )}
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
