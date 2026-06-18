import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/auth/currentUser";
import { CLASSES, RACES } from "../lib/game/characterOptions";
import { getLocationByKey } from "../lib/game/worldLocations";

function getLocationDisplayName(locationKey) {
  return getLocationByKey(locationKey)?.name || locationKey;
}

export default function Dashboard({ user }) {
  const router = useRouter();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [name, setName] = useState("");
  const [race, setRace] = useState(RACES[0]);
  const [characterClass, setCharacterClass] = useState(CLASSES[0]);

  useEffect(() => {
    let isActive = true;

    async function loadInitialCharacters() {
      try {
        const response = await fetch("/api/characters");
        const data = await response.json();

        if (!isActive) {
          return;
        }

        if (!response.ok) {
          setError(data.error || "Characters could not be loaded.");
          setCharacters([]);
          return;
        }

        setCharacters(data.characters || []);
      } catch {
        if (isActive) {
          setError("Characters could not be loaded.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadInitialCharacters();

    return () => {
      isActive = false;
    };
  }, []);

  async function loadCharacters() {
    const response = await fetch("/api/characters");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Characters could not be loaded.");
    }

    setCharacters(data.characters || []);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
  }

  async function handleCreateCharacter(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          race,
          characterClass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Character creation failed.");
        return;
      }

      setName("");
      setRace(RACES[0]);
      setCharacterClass(CLASSES[0]);
      setSuccessMessage(`${data.character.name} has taken the first step onto the road.`);
      await loadCharacters();
    } catch (creationError) {
      setError(creationError.message || "Character creation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Dashboard | Zakzum Online</title>
        <meta
          name="description"
          content="The protected Zakzum Online dashboard shell for future characters and saved progress."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="dashboard-title">
          <Link className="text-link" href="/">
            Zakzum Online
          </Link>
          <p className="eyebrow">Protected Game Shell</p>
          <h1 id="dashboard-title">Dashboard</h1>
          <p className="supporting-text">
            The road opens from here. Saved progress and surviving names will
            gather in this place.
          </p>
          <p className="lead compact-lead">Welcome, {user.username}.</p>

          <section className="session-panel" aria-labelledby="characters-title">
            <h2 id="characters-title">Characters</h2>
            {loading && characters.length === 0 ? (
              <p className="supporting-text">Searching the road...</p>
            ) : null}
            {!loading && characters.length === 0 ? (
              <p className="empty-state">No characters yet.</p>
            ) : null}
            {characters.length > 0 ? (
              <div className="character-list">
                {characters.map((character) => (
                  <Link
                    className="character-card"
                    href={`/characters/${character.id}`}
                    key={character.id}
                  >
                    <h3>{character.name}</h3>
                    <p className="supporting-text">
                      {character.race} {character.characterClass}
                    </p>
                    <dl className="character-stats">
                      <div>
                        <dt>Level</dt>
                        <dd>{character.level}</dd>
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
                    </dl>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>

          <section className="session-panel" aria-labelledby="create-character-title">
            <h2 id="create-character-title">Create Character</h2>
            <p className="supporting-text">
              Begin with a name, a people, and a path. The road will decide what
              survives.
            </p>

            <form className="auth-form" onSubmit={handleCreateCharacter}>
              <label className="field-label" htmlFor="character-name">
                Name
              </label>
              <input
                id="character-name"
                name="name"
                type="text"
                minLength={2}
                maxLength={40}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <label className="field-label" htmlFor="character-race">
                Race
              </label>
              <select
                id="character-race"
                name="race"
                value={race}
                onChange={(event) => setRace(event.target.value)}
              >
                {RACES.map((raceOption) => (
                  <option key={raceOption} value={raceOption}>
                    {raceOption}
                  </option>
                ))}
              </select>

              <label className="field-label" htmlFor="character-class">
                Class
              </label>
              <select
                id="character-class"
                name="characterClass"
                value={characterClass}
                onChange={(event) => setCharacterClass(event.target.value)}
              >
                {CLASSES.map((classOption) => (
                  <option key={classOption} value={classOption}>
                    {classOption}
                  </option>
                ))}
              </select>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Working..." : "Create Character"}
              </button>
            </form>

            {error ? <p className="form-message error">{error}</p> : null}
            {successMessage ? (
              <p className="form-message success">{successMessage}</p>
            ) : null}
          </section>

          <div className="account-actions">
            <Link className="secondary-button" href="/account">
              Account
            </Link>
            <Link className="secondary-button" href="/">
              Home
            </Link>
            <button className="primary-button" type="button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const user = await getCurrentUser(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
