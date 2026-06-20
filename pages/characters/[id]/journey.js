import { useState } from "react";
import CharacterPageLayout from "../../../lib/game/characterPageLayout";
import { getLocationDisplayName } from "../../../lib/game/characterPageHelpers";
import {
  restCharacter,
  travelCharacter,
} from "../../../lib/game/characterPageRequests";
import { getCharacterPageServerSideProps } from "../../../lib/game/characterPageServer";
import {
  canRest,
  getRestResult,
  getRestValidationError,
} from "../../../lib/game/restRules";
import {
  getTravelCost,
  getTravelCostValidationError,
  hasEnoughStaminaForTravel,
} from "../../../lib/game/travelCostRules";
import {
  getAvailableTravelDestinations,
  getTravelDestinationSummary,
} from "../../../lib/game/travelRules";

export default function CharacterJourneyPage({ character }) {
  const [currentLocationKey, setCurrentLocationKey] = useState(
    character.currentLocation,
  );
  const [currentLocationName, setCurrentLocationName] = useState(
    getLocationDisplayName(character.currentLocation),
  );
  const [stamina, setStamina] = useState(character.stamina);
  const [maxStamina, setMaxStamina] = useState(character.maxStamina);
  const [stress, setStress] = useState(character.stress);
  const [selectedDestinationLocationKey, setSelectedDestinationLocationKey] =
    useState(
      () =>
        getAvailableTravelDestinations({
          currentLocationKey: character.currentLocation,
        })[0]?.key || "",
    );
  const [travelLoading, setTravelLoading] = useState(false);
  const [travelError, setTravelError] = useState("");
  const [travelSuccess, setTravelSuccess] = useState("");
  const [restLoading, setRestLoading] = useState(false);
  const [restError, setRestError] = useState("");
  const [restSuccess, setRestSuccess] = useState("");

  const currentLocationSummary = getTravelDestinationSummary(currentLocationKey);
  const travelDestinations = getAvailableTravelDestinations({
    currentLocationKey,
  });
  const firstTravelDestinationKey = travelDestinations[0]?.key || "";
  const activeDestinationLocationKey =
    selectedDestinationLocationKey || firstTravelDestinationKey;
  const selectedDestination = getTravelDestinationSummary(
    activeDestinationLocationKey,
  );
  const selectedTravelCost = activeDestinationLocationKey
    ? getTravelCost({
        currentLocationKey,
        destinationLocationKey: activeDestinationLocationKey,
      })
    : null;
  const travelCostValidationError = activeDestinationLocationKey
    ? getTravelCostValidationError({
        stamina,
        travelCost: selectedTravelCost,
      })
    : "";
  const hasEnoughStamina = hasEnoughStaminaForTravel({
    stamina,
    travelCost: selectedTravelCost,
  });
  const restValues = { stamina, maxStamina, stress };
  const restResult = getRestResult(restValues);
  const restAllowed = canRest(restValues);
  const restValidationError = getRestValidationError(restValues);
  const restValidationMessage =
    restValidationError === "There is nothing to recover."
      ? "There is nothing to recover right now."
      : restValidationError;

  async function handleTravel(event) {
    event.preventDefault();
    setTravelLoading(true);
    setTravelError("");
    setTravelSuccess("");

    if (!activeDestinationLocationKey) {
      setTravelLoading(false);
      setTravelError("Choose a destination before traveling.");
      return;
    }

    try {
      const data = await travelCharacter(character.id, activeDestinationLocationKey);
      const nextLocationKey =
        data.character?.currentLocation || activeDestinationLocationKey;
      const nextLocationName =
        data.character?.currentLocationName ||
        getLocationDisplayName(nextLocationKey);

      setCurrentLocationKey(nextLocationKey);
      setCurrentLocationName(nextLocationName);
      setStamina(
        typeof data.character?.stamina === "number"
          ? data.character.stamina
          : stamina,
      );
      setMaxStamina(
        typeof data.character?.maxStamina === "number"
          ? data.character.maxStamina
          : maxStamina,
      );
      setStress(
        typeof data.character?.stress === "number" ? data.character.stress : stress,
      );
      setSelectedDestinationLocationKey(
        getAvailableTravelDestinations({ currentLocationKey: nextLocationKey })[0]
          ?.key || "",
      );
      setTravelSuccess(`Travel completed to ${nextLocationName}.`);
    } catch (error) {
      setTravelError(error.message || "Travel could not be completed.");
    } finally {
      setTravelLoading(false);
    }
  }

  async function handleRest() {
    setRestLoading(true);
    setRestError("");
    setRestSuccess("");

    if (!restAllowed || !restResult || restValidationError) {
      setRestLoading(false);
      setRestError(restValidationMessage || "Rest could not be prepared.");
      return;
    }

    try {
      const data = await restCharacter(character.id);

      setStamina(
        typeof data.character?.stamina === "number"
          ? data.character.stamina
          : stamina,
      );
      setMaxStamina(
        typeof data.character?.maxStamina === "number"
          ? data.character.maxStamina
          : maxStamina,
      );
      setStress(
        typeof data.character?.stress === "number" ? data.character.stress : stress,
      );
      setRestSuccess(data.message || "Rest completed.");
    } catch (error) {
      setRestError(error.message || "Rest could not be completed.");
    } finally {
      setRestLoading(false);
    }
  }

  return (
    <CharacterPageLayout
      character={character}
      description="Travel and rest are isolated here so live testing stays focused on road actions."
      pageTitle="Journey"
      summaryText={`${character.race} ${character.characterClass} at ${currentLocationName}. Stamina ${stamina} / ${maxStamina}.`}
    >
      <section className="session-panel" aria-labelledby="journey-record-title">
        <h2 id="journey-record-title">Current Route</h2>
        <dl className="sheet-grid">
          <div>
            <dt>Location</dt>
            <dd>{currentLocationName}</dd>
          </div>
          <div>
            <dt>Realm</dt>
            <dd>{currentLocationSummary?.realmName || "Unknown realm"}</dd>
          </div>
          <div>
            <dt>Stamina</dt>
            <dd>
              {stamina} / {maxStamina}
            </dd>
          </div>
          <div>
            <dt>Stress</dt>
            <dd>{stress}</dd>
          </div>
        </dl>
      </section>

      <section className="session-panel" aria-labelledby="travel-title">
        <h2 id="travel-title">Travel</h2>
        <p className="supporting-text">
          Choose the next road without pulling quest, inventory, and activity panels into the same page.
        </p>
        {travelDestinations.length === 0 ? (
          <p className="empty-state">No further roads are open from this location yet.</p>
        ) : null}
        <form className="auth-form" onSubmit={handleTravel}>
          <label className="field-label" htmlFor="destination-location">
            Destination
          </label>
          <select
            disabled={travelDestinations.length === 0 || travelLoading}
            id="destination-location"
            name="destinationLocationKey"
            onChange={(event) => setSelectedDestinationLocationKey(event.target.value)}
            value={activeDestinationLocationKey}
          >
            {travelDestinations.map((destination) => (
              <option key={destination.key} value={destination.key}>
                {destination.name} / {destination.realmName}
              </option>
            ))}
          </select>

          {selectedDestination ? (
            <article className="inventory-item">
              <div>
                <h3>{selectedDestination.name}</h3>
                <p className="item-meta">
                  {selectedDestination.realmName} / {selectedDestination.type}
                </p>
              </div>
              <p className="supporting-text">{selectedDestination.shortDescription}</p>
            </article>
          ) : null}

          {selectedTravelCost ? (
            <article className="inventory-item">
              <div>
                <h3>Travel Cost</h3>
                <p className="item-meta">
                  {selectedTravelCost.isSameRealm
                    ? "Same realm road"
                    : "Cross-realm road"}
                </p>
              </div>
              <dl className="inventory-details">
                <div>
                  <dt>Stamina Cost</dt>
                  <dd>{selectedTravelCost.staminaCost}</dd>
                </div>
                <div>
                  <dt>Stress Gain</dt>
                  <dd>{selectedTravelCost.stressGain}</dd>
                </div>
              </dl>
              <p className="supporting-text">
                {hasEnoughStamina
                  ? "This road can be taken with your current stamina."
                  : "Too little stamina remains for this road."}
              </p>
            </article>
          ) : null}

          {travelCostValidationError ? (
            <p className="form-message error">{travelCostValidationError}</p>
          ) : null}

          <button
            className="primary-button"
            disabled={
              travelLoading ||
              !activeDestinationLocationKey ||
              !selectedTravelCost ||
              Boolean(travelCostValidationError) ||
              travelDestinations.length === 0
            }
            type="submit"
          >
            {travelLoading ? "Traveling..." : "Travel"}
          </button>
        </form>

        {travelError ? <p className="form-message error">{travelError}</p> : null}
        {travelSuccess ? (
          <p className="form-message success">{travelSuccess}</p>
        ) : null}
      </section>

      <section className="session-panel" aria-labelledby="rest-title">
        <h2 id="rest-title">Rest</h2>
        <p className="supporting-text">
          Step away from the road long enough to steady body and mind.
        </p>
        <dl className="sheet-grid">
          <div>
            <dt>Current Stamina</dt>
            <dd>{stamina}</dd>
          </div>
          <div>
            <dt>Maximum Stamina</dt>
            <dd>{maxStamina}</dd>
          </div>
          <div>
            <dt>Current Stress</dt>
            <dd>{stress}</dd>
          </div>
        </dl>

        {restAllowed && restResult ? (
          <article className="inventory-item">
            <div>
              <h3>Recovery Preview</h3>
              <p className="item-meta">Before the road resumes</p>
            </div>
            <dl className="inventory-details">
              <div>
                <dt>Stamina After</dt>
                <dd>{restResult.staminaAfter}</dd>
              </div>
              <div>
                <dt>Stress After</dt>
                <dd>{restResult.stressAfter}</dd>
              </div>
              <div>
                <dt>Stamina Recovered</dt>
                <dd>{restResult.staminaRecovered}</dd>
              </div>
              <div>
                <dt>Stress Reduced</dt>
                <dd>{restResult.stressReduced}</dd>
              </div>
            </dl>
          </article>
        ) : null}

        {!restAllowed && restValidationMessage ? (
          <p className="empty-state">{restValidationMessage}</p>
        ) : null}

        <button
          className="primary-button"
          disabled={
            restLoading || !restAllowed || !restResult || Boolean(restValidationError)
          }
          onClick={handleRest}
          type="button"
        >
          {restLoading ? "Resting..." : "Rest"}
        </button>

        {restError ? <p className="form-message error">{restError}</p> : null}
        {restSuccess ? <p className="form-message success">{restSuccess}</p> : null}
      </section>
    </CharacterPageLayout>
  );
}

export const getServerSideProps = getCharacterPageServerSideProps;