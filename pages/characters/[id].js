import Link from "next/link";
import CharacterPageLayout from "../../lib/game/characterPageLayout";
import {
  formatDate,
  getCharacterPageLinks,
  getLocationDisplayName,
} from "../../lib/game/characterPageHelpers";
import { getCharacterPageServerSideProps } from "../../lib/game/characterPageServer";
import { getExperienceProgress } from "../../lib/game/levelRules";

function LevelProgress({ character }) {
  const progress = getExperienceProgress({
    level: character.level,
    experience: character.experience,
  });
  const progressPercent =
    typeof progress.progressPercent === "number" ? progress.progressPercent : 0;
  const hasNextLevel = progress.nextLevel !== null;

  return (
    <section className="session-panel" aria-labelledby="level-progress-title">
      <h2 id="level-progress-title">Level Progress</h2>
      <dl className="sheet-grid">
        <div>
          <dt>Current Level</dt>
          <dd>{progress.level ?? character.level}</dd>
        </div>
        <div>
          <dt>Current Experience</dt>
          <dd>{progress.experience ?? character.experience}</dd>
        </div>
        <div>
          <dt>Next Level</dt>
          <dd>{hasNextLevel ? progress.nextLevel : "None"}</dd>
        </div>
        <div>
          <dt>Next Threshold</dt>
          <dd>
            {hasNextLevel
              ? progress.nextLevelThreshold
              : "Current level table complete"}
          </dd>
        </div>
        <div>
          <dt>Experience Needed</dt>
          <dd>
            {hasNextLevel
              ? progress.experienceNeededForNextLevel
              : "Current level table complete"}
          </dd>
        </div>
        <div>
          <dt>Progress</dt>
          <dd>{progress.progressPercent ?? 0}%</dd>
        </div>
      </dl>
      <div
        aria-label="Experience progress toward next level"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progressPercent}
        className="level-progress-meter"
        role="progressbar"
      >
        <span style={{ width: `${progressPercent}%` }} />
      </div>
      {!hasNextLevel ? (
        <p className="supporting-text">Current level table complete.</p>
      ) : null}
    </section>
  );
}

export default function CharacterOverviewPage({ character }) {
  const pageLinks = getCharacterPageLinks(character.id).filter(
    (pageLink) => pageLink.label !== "Overview",
  );

  return (
    <CharacterPageLayout
      character={character}
      description="Use the page navigation to move through the character sheet without loading one long scrolling page."
      pageTitle="Overview"
    >
      <section className="session-panel" aria-labelledby="sheet-title">
        <h2 id="sheet-title">Current Record</h2>
        <dl className="sheet-grid">
          <div>
            <dt>Race</dt>
            <dd>{character.race}</dd>
          </div>
          <div>
            <dt>Class</dt>
            <dd>{character.characterClass}</dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd>{character.level}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{character.experience}</dd>
          </div>
          <div>
            <dt>Gold</dt>
            <dd>{character.gold}</dd>
          </div>
          <div>
            <dt>Stamina</dt>
            <dd>
              {character.stamina} / {character.maxStamina}
            </dd>
          </div>
          <div>
            <dt>Stress</dt>
            <dd>{character.stress}</dd>
          </div>
          <div>
            <dt>Renown</dt>
            <dd>{character.renown}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{getLocationDisplayName(character.currentLocation)}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{formatDate(character.createdAt)}</dd>
          </div>
        </dl>
      </section>

      <LevelProgress character={character} />

      <section className="session-panel" aria-labelledby="pages-title">
        <h2 id="pages-title">Character Pages</h2>
        <p className="supporting-text">
          Open the section you want to test instead of carrying every system on one screen.
        </p>
        <div className="character-section-links">
          {pageLinks.map((pageLink) => (
            <Link className="character-section-link" href={pageLink.href} key={pageLink.href}>
              <h3>{pageLink.label}</h3>
              <p className="supporting-text">{pageLink.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="session-panel" aria-labelledby="testing-title">
        <h2 id="testing-title">Testing Focus</h2>
        <ul className="placeholder-list">
          <li>Journey keeps travel and rest together on one smaller page.</li>
          <li>Quests isolates the local quest list and acceptance flow.</li>
          <li>Inventory keeps gear changes separate from the activity record.</li>
          <li>Activity loads only the character log when you need the history.</li>
        </ul>
      </section>
    </CharacterPageLayout>
  );
}

export const getServerSideProps = getCharacterPageServerSideProps;
