import { getCurrentUser } from "../../../../../lib/auth/currentUser";
import { createActivityLog } from "../../../../../lib/game/activityLog";
import {
  canEquipItem,
  getEquippedSlotConflict,
} from "../../../../../lib/game/equipmentRules";
import prisma from "../../../../../lib/prisma";

function toSafeItem(item) {
  return {
    id: item.id,
    key: item.key,
    name: item.name,
    type: item.type,
    slot: item.slot,
    description: item.description,
    quantity: item.quantity,
    isEquipped: item.isEquipped,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

async function getOwnedCharacter(characterId, userId) {
  if (!characterId) {
    return null;
  }

  return prisma.character.findFirst({
    where: {
      id: characterId,
      userId,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

async function getCharacterItem(itemId, characterId) {
  if (!itemId) {
    return null;
  }

  return prisma.characterItem.findFirst({
    where: {
      id: itemId,
      characterId,
    },
  });
}

function getAction(req) {
  return typeof req.body?.action === "string" ? req.body.action.trim() : "";
}

async function handleEquip(res, character, item) {
  if (!canEquipItem(item)) {
    return res.status(400).json({
      error: "This item cannot be equipped.",
    });
  }

  if (item.isEquipped) {
    return res.status(200).json({
      message: "Item is already equipped.",
      item: toSafeItem(item),
    });
  }

  const inventoryItems = await prisma.characterItem.findMany({
    where: { characterId: character.id },
  });

  const slotConflict = getEquippedSlotConflict(inventoryItems, item);

  if (slotConflict) {
    return res.status(409).json({
      error: "Another item is already equipped in that slot.",
    });
  }

  const updatedItem = await prisma.$transaction(async (tx) => {
    const equippedItem = await tx.characterItem.update({
      where: { id: item.id },
      data: { isEquipped: true },
    });

    await createActivityLog(
      {
        characterId: character.id,
        type: "item_equipped",
        title: "Item Equipped",
        description: "A tool was made ready for the road ahead.",
        details: {
          characterName: character.name,
          itemName: equippedItem.name,
          itemType: equippedItem.type,
          itemSlot: equippedItem.slot,
        },
      },
      tx,
    );

    return equippedItem;
  });

  return res.status(200).json({
    message: "Item equipped.",
    item: toSafeItem(updatedItem),
  });
}

async function handleUnequip(res, character, item) {
  if (!item.isEquipped) {
    return res.status(200).json({
      message: "Item is already unequipped.",
      item: toSafeItem(item),
    });
  }

  const updatedItem = await prisma.$transaction(async (tx) => {
    const unequippedItem = await tx.characterItem.update({
      where: { id: item.id },
      data: { isEquipped: false },
    });

    await createActivityLog(
      {
        characterId: character.id,
        type: "item_unequipped",
        title: "Item Unequipped",
        description: "A tool was returned to the pack.",
        details: {
          characterName: character.name,
          itemName: unequippedItem.name,
          itemType: unequippedItem.type,
          itemSlot: unequippedItem.slot,
        },
      },
      tx,
    );

    return unequippedItem;
  });

  return res.status(200).json({
    message: "Item unequipped.",
    item: toSafeItem(updatedItem),
  });
}

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const action = getAction(req);

    if (!["equip", "unequip"].includes(action)) {
      return res.status(400).json({
        error: "Unsupported inventory item action.",
      });
    }

    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const characterId = getQueryValue(req.query.id);
    const itemId = getQueryValue(req.query.itemId);
    const character = await getOwnedCharacter(characterId, user.id);

    if (!character) {
      return res.status(404).json({ error: "Inventory item not found." });
    }

    const item = await getCharacterItem(itemId, character.id);

    if (!item) {
      return res.status(404).json({ error: "Inventory item not found." });
    }

    if (action === "equip") {
      return handleEquip(res, character, item);
    }

    return handleUnequip(res, character, item);
  } catch (error) {
    console.error("Character inventory item API failed:", error);
    return res.status(500).json({ error: "Inventory item request failed." });
  }
}
