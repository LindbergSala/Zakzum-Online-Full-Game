import { useEffect, useState } from "react";
import CharacterPageLayout from "../../../lib/game/characterPageLayout";
import { getCharacterPageServerSideProps } from "../../../lib/game/characterPageServer";
import {
  fetchCharacterInventory,
  requestCharacterEquipmentAction,
  requestStarterEquipmentAssignment,
} from "../../../lib/game/characterPageRequests";
import {
  EQUIPPABLE_SLOTS,
  isEquippableSlot,
} from "../../../lib/game/equipmentRules";
import { getStarterEquipmentForClass } from "../../../lib/game/starterEquipment";

export default function CharacterInventoryPage({ character }) {
  const starterEquipment = getStarterEquipmentForClass(character.characterClass);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState("");
  const [inventorySuccess, setInventorySuccess] = useState("");
  const [assigningStarterEquipment, setAssigningStarterEquipment] =
    useState(false);
  const [equipmentActionLoadingItemId, setEquipmentActionLoadingItemId] =
    useState("");
  const [equipmentActionError, setEquipmentActionError] = useState("");
  const [equipmentActionSuccess, setEquipmentActionSuccess] = useState("");
  const equippedSlots = EQUIPPABLE_SLOTS.map((slot) => ({
    slot,
    item: inventoryItems.find((item) => item.slot === slot && item.isEquipped),
  }));

  async function loadInventory() {
    setInventoryLoading(true);
    setInventoryError("");

    try {
      const data = await fetchCharacterInventory(character.id);

      setInventoryItems(data.items || []);
    } catch (error) {
      setInventoryError(error.message || "Inventory could not be loaded.");
      setInventoryItems([]);
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
        const data = await fetchCharacterInventory(character.id);

        if (!isActive) {
          return;
        }

        setInventoryItems(data.items || []);
      } catch (error) {
        if (isActive) {
          setInventoryError(error.message || "Inventory could not be loaded.");
          setInventoryItems([]);
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
    setEquipmentActionError("");
    setEquipmentActionSuccess("");

    try {
      const { response, data } = await requestStarterEquipmentAssignment(
        character.id,
      );

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
    } catch (error) {
      setInventoryError(error.message || "Starter equipment could not be assigned.");
    } finally {
      setAssigningStarterEquipment(false);
    }
  }

  async function handleEquipmentAction(item, action) {
    const actionPastTense = action === "equip" ? "equipped" : "unequipped";

    setEquipmentActionLoadingItemId(item.id);
    setEquipmentActionError("");
    setEquipmentActionSuccess("");
    setInventoryError("");
    setInventorySuccess("");

    try {
      const { response, data } = await requestCharacterEquipmentAction(
        character.id,
        item.id,
        action,
      );

      if (response.status === 409) {
        setEquipmentActionError(
          data.error || "That equipment slot is already in use.",
        );
        await loadInventory();
        return;
      }

      if (response.status === 400) {
        setEquipmentActionError(data.error || "That item cannot be equipped.");
        await loadInventory();
        return;
      }

      if (!response.ok) {
        setEquipmentActionError(
          data.error || `The item could not be ${actionPastTense}.`,
        );
        return;
      }

      setEquipmentActionSuccess(
        data.message ||
          (action === "equip" ? "Item equipped." : "Item unequipped."),
      );
      await loadInventory();
    } catch (error) {
      setEquipmentActionError(
        error.message || `The item could not be ${actionPastTense}.`,
      );
    } finally {
      setEquipmentActionLoadingItemId("");
    }
  }

  return (
    <CharacterPageLayout
      character={character}
      description="Equipment management now stays on a dedicated page so gear testing does not compete with travel and quest panels."
      pageTitle="Inventory"
    >
      <section className="session-panel" aria-labelledby="currently-equipped-title">
        <h2 id="currently-equipped-title">Currently Equipped</h2>
        <p className="supporting-text">
          The gear made ready for the road. This summary is read-only for now.
        </p>
        {inventoryLoading ? (
          <p className="supporting-text">Checking equipped gear...</p>
        ) : null}
        {!inventoryLoading ? (
          <div className="equipped-summary-list">
            {equippedSlots.map(({ slot, item }) => (
              <article className="equipped-slot-card" key={slot}>
                <p className="item-meta">{slot}</p>
                {item ? (
                  <>
                    <h3>{item.name}</h3>
                    <p className="item-meta">
                      {item.type} / {item.slot}
                    </p>
                    <p className="supporting-text">{item.description}</p>
                  </>
                ) : (
                  <p className="empty-state">Nothing equipped</p>
                )}
              </article>
            ))}
          </div>
        ) : null}
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
                <div className="inventory-item-actions">
                  {item.isEquipped ? (
                    <button
                      className="secondary-button small-action-button"
                      disabled={equipmentActionLoadingItemId === item.id}
                      onClick={() => handleEquipmentAction(item, "unequip")}
                      type="button"
                    >
                      {equipmentActionLoadingItemId === item.id
                        ? "Unequipping..."
                        : "Unequip"}
                    </button>
                  ) : null}
                  {!item.isEquipped && isEquippableSlot(item.slot) ? (
                    <button
                      className="secondary-button small-action-button"
                      disabled={equipmentActionLoadingItemId === item.id}
                      onClick={() => handleEquipmentAction(item, "equip")}
                      type="button"
                    >
                      {equipmentActionLoadingItemId === item.id
                        ? "Equipping..."
                        : "Equip"}
                    </button>
                  ) : null}
                  {!item.isEquipped && !isEquippableSlot(item.slot) ? (
                    <p className="item-action-note">
                      {item.slot === "pack" ? "Carried item" : "Not equippable"}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {!inventoryLoading && inventoryItems.length === 0 ? (
          <button
            className="primary-button"
            disabled={assigningStarterEquipment}
            onClick={handleAssignStarterEquipment}
            type="button"
          >
            {assigningStarterEquipment ? "Assigning..." : "Assign Starter Equipment"}
          </button>
        ) : null}

        {inventoryError ? <p className="form-message error">{inventoryError}</p> : null}
        {inventorySuccess ? (
          <p className="form-message success">{inventorySuccess}</p>
        ) : null}
        {equipmentActionError ? (
          <p className="form-message error">{equipmentActionError}</p>
        ) : null}
        {equipmentActionSuccess ? (
          <p className="form-message success">{equipmentActionSuccess}</p>
        ) : null}
      </section>

      <section className="session-panel" aria-labelledby="starter-equipment-title">
        <h2 id="starter-equipment-title">Starter Equipment Preview</h2>
        <p className="supporting-text">
          This class-based kit is reference only. Saved inventory appears in the Equipment section above.
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
    </CharacterPageLayout>
  );
}

export const getServerSideProps = getCharacterPageServerSideProps;