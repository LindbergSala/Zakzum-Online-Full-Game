export const EQUIPPABLE_SLOTS = ["mainHand", "offHand", "body"];

export const NON_EQUIPPABLE_SLOTS = ["pack", "none"];

export function isEquippableSlot(slot) {
  return EQUIPPABLE_SLOTS.includes(slot);
}

export function canEquipItem(item) {
  return Boolean(item && isEquippableSlot(item.slot));
}

export function getEquippedSlotConflict(items, item) {
  if (!Array.isArray(items) || !canEquipItem(item)) {
    return null;
  }

  return (
    items.find((inventoryItem) => {
      const isSameItem = item.id && inventoryItem.id === item.id;

      return (
        !isSameItem &&
        inventoryItem.isEquipped &&
        inventoryItem.slot === item.slot
      );
    }) || null
  );
}
