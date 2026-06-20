import { useEffect, useState } from "react";
import CharacterPageLayout from "../../../lib/game/characterPageLayout";
import { fetchCharacterActivityLogs } from "../../../lib/game/characterPageRequests";
import { getCharacterPageServerSideProps } from "../../../lib/game/characterPageServer";
import {
  formatDate,
  formatDetails,
} from "../../../lib/game/characterPageHelpers";

export default function CharacterActivityPage({ character }) {
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityLogLoading, setActivityLogLoading] = useState(true);
  const [activityLogError, setActivityLogError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadActivityLogs() {
      setActivityLogLoading(true);
      setActivityLogError("");

      try {
        const data = await fetchCharacterActivityLogs(character.id);

        if (!isActive) {
          return;
        }

        setActivityLogs(data.activityLogs || []);
      } catch (error) {
        if (isActive) {
          setActivityLogError(error.message || "Activity log could not be loaded.");
          setActivityLogs([]);
        }
      } finally {
        if (isActive) {
          setActivityLogLoading(false);
        }
      }
    }

    loadActivityLogs();

    return () => {
      isActive = false;
    };
  }, [character.id]);

  return (
    <CharacterPageLayout
      character={character}
      description="The activity record now has its own page, so log review does not sit underneath travel and inventory controls."
      pageTitle="Activity"
    >
      <section className="session-panel" aria-labelledby="activity-log-title">
        <h2 id="activity-log-title">Activity Log</h2>
        <p className="supporting-text">
          The road remembers what this character has survived. For now, this record is read-only.
        </p>
        {activityLogLoading ? (
          <p className="supporting-text">Reading the character record...</p>
        ) : null}
        {activityLogError ? (
          <p className="form-message error">{activityLogError}</p>
        ) : null}
        {!activityLogLoading && !activityLogError && activityLogs.length === 0 ? (
          <p className="empty-state">No recorded activity yet.</p>
        ) : null}
        {!activityLogLoading && !activityLogError && activityLogs.length > 0 ? (
          <div className="activity-log-list">
            {activityLogs.map((activityLog) => (
              <article className="activity-log-item" key={activityLog.id}>
                <div>
                  <h3>{activityLog.title}</h3>
                  <p className="item-meta">
                    {activityLog.type} / {formatDate(activityLog.createdAt)}
                  </p>
                </div>
                <p className="supporting-text">{activityLog.description}</p>
                {activityLog.details ? (
                  <pre className="activity-log-details">
                    {formatDetails(activityLog.details)}
                  </pre>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </CharacterPageLayout>
  );
}

export const getServerSideProps = getCharacterPageServerSideProps;