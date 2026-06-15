import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../lib/auth/currentUser";
import { getStarterEquipmentForClass } from "../../lib/game/starterEquipment";
import prisma from "../../lib/prisma";

function toSafeCharacter(character) {
  return {
    id: character.id,
    name: character.name,
    race: character.race,
    characterClass: character.characterClass,
    level: character.level,
    experience: character.experience,
    gold: character.gold,
    stamina: character.stamina,
    maxStamina: character.maxStamina,
    stress: character.stress,
    renown: character.renown,
    currentLocation: character.currentLocation,
    createdAt: character.createdAt.toISOString(),
  };
}

function formatDate(dateValue) {
  return dateValue.split("T")[0];
}

export default function CharacterDetail({ character }) {
  const starterEquipment = getStarterEquipmentForClass(character.characterClass);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState("");
  const [inventorySuccess, setInventorySuccess] = useState("");
  const [assigningStarterEquipment, setAssigningStarterEquipment] = useState(false);

  async function loadInventory() {
    setInventoryLoading(true);
    setInventoryError("");

    try {
      const response = await fetch(`/api/characters/${character.id}/inventory`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Inventory could not be loaded.");
      }

      setInventoryItems(data.items || []);
    } finally {
      setInventoryLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    async function loadInitialInventory() {
      setInventoryLoading(true);
      setInventoryError("");

      try {
        const response = await fetch(`/api/characters/${character.id}/inventory`);
        const data = await response.json();

        if (!isActive) {
          return;
        }

        if (!response.ok) {
          setInventoryError(data.error || "Inventory could not be loaded.");
          setInventoryItems([]);
          return;
        }

        setInventoryItems(data.items || []);
      } catch {
        if (isActive) {
          setInventoryError("Inventory could not be loaded.");
        }
      } finally {
        if (isActive) {
          setInventoryLoading(false);
        }
      }
    }

    loadInitialInventory();

    return () => {
      isActive = false;
    };
  }, [character.id]);

  async function handleAssignStarterEquipment() {
    setAssigningStarterEquipment(true);
    setInventoryError("");
    setInventorySuccess("");

    try {
      const response = await fetch(`/api/characters/${character.id}/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "assignStarterEquipment",
        }),
      });
      const data = await response.json();

      if (response.status === 409) {
        await loadInventory();
        setInventoryError("Starter equipment is already saved for this character.");
        return;
      }

      if (!response.ok) {
        setInventoryError(data.error || "Starter equipment could not be assigned.");
        return;
      }

      setInventoryItems(data.items || []);
      setInventorySuccess("Starter equipment has been saved to this character.");
      await loadInventory();
    } catch (error) {
      setInventoryError(error.message || "Starter equipment could not be assigned.");
    } finally {
      setAssigningStarterEquipment(false);
    }
  }

  return (
    <>
      <Head>
        <title>{character.name} | Zakzum Online</title>
        <meta
          name="description"
          content="A read-only Zakzum Online character sheet foundation."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="auth-page">
        <section className="auth-panel character-sheet" aria-labelledby="character-title">
          <Link className="text-link" href="/dashboard">
            Back to Dashboard
          </Link>
          <p className="eyebrow">Character Sheet</p>
          <h1 id="character-title">{character.name}</h1>
          <p className="supporting-text">
            A new traveler stands at the edge of the road, carrying little more
            than a name and the trouble that waits ahead.
          </p>

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
                <dd>{character.currentLocation}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{formatDate(character.createdAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="session-panel" aria-labelledby="journey-record-title">
            <h2 id="journey-record-title">Journey Record</h2>
            <p className="empty-state">Activity log coming soon.</p>
          </section>

          <section className="session-panel" aria-labelledby="equipment-title">
            <h2 id="equipment-title">Equipment</h2>
            <p className="supporting-text">
              Saved inventory is stored separately from the starter preview below.
            </p>
            {inventoryLoading ? (
              <p className="supporting-text">Checking saved equipment...</p>
            ) : null}
            {!inventoryLoading && inventoryItems.length === 0 ? (
              <p className="empty-state">No saved equipment yet.</p>
            ) : null}
            {!inventoryLoading && inventoryItems.length > 0 ? (
              <div className="inventory-list">
                {inventoryItems.map((item) => (
                  <article className="inventory-item" key={item.id}>
                    <div>
                      <h3>{item.name}</h3>
                      <p className="item-meta">
                        {item.type} / {item.slot}
                      </p>
                    </div>
                    <dl className="inventory-details">
                      <div>
                        <dt>Quantity</dt>
                        <dd>{item.quantity}</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>{item.isEquipped ? "Equipped" : "Packed"}</dd>
                      </div>
                    </dl>
                    <p className="supporting-text">{item.description}</p>
                  </article>
                ))}
              </div>
            ) : null}
            {!inventoryLoading && inventoryItems.length === 0 ? (
              <button
                className="primary-button"
                type="button"
                onClick={handleAssignStarterEquipment}
                disabled={assigningStarterEquipment}
              >
                {assigningStarterEquipment
                  ? "Assigning..."
                  : "Assign Starter Equipment"}
              </button>
            ) : null}
            {inventoryError ? (
              <p className="form-message error">{inventoryError}</p>
            ) : null}
            {inventorySuccess ? (
              <p className="form-message success">{inventorySuccess}</p>
            ) : null}
          </section>

          <section className="session-panel" aria-labelledby="starter-equipment-title">
            <h2 id="starter-equipment-title">Starter Equipment Preview</h2>
            <p className="supporting-text">
              This class-based kit is reference only. Saved inventory appears in
              the Equipment section above.
            </p>
            <div className="equipment-preview-list">
              {starterEquipment.map((item) => (
                <article className="equipment-preview-item" key={item.key}>
                  <div>
                    <h3>{item.name}</h3>
                    <p className="item-meta">
                      {item.type} / {item.slot}
                    </p>
                  </div>
                  <p className="supporting-text">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="session-panel" aria-labelledby="actions-title">
            <h2 id="actions-title">Actions</h2>
            <ul className="placeholder-list">
              <li>Rest coming soon.</li>
              <li>Travel coming soon.</li>
              <li>Quests coming soon.</li>
              <li>Combat coming soon.</li>
            </ul>
          </section>

          <div className="account-actions">
            <Link className="primary-button" href="/dashboard">
              Dashboard
            </Link>
            <Link className="secondary-button" href="/account">
              Account
            </Link>
            <Link className="secondary-button" href="/">
              Home
            </Link>
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

  const characterId = Array.isArray(context.params.id)
    ? context.params.id[0]
    : context.params.id;

  const character = await prisma.character.findFirst({
    where: {
      id: characterId,
      userId: user.id,
    },
  });

  if (!character) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      character: toSafeCharacter(character),
    },
  };
}
