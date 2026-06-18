import { getCurrentUser } from "../../../../lib/auth/currentUser";
import { createActivityLog } from "../../../../lib/game/activityLog";
import { getStarterEquipmentForClass } from "../../../../lib/game/starterEquipment";
import prisma from "../../../../lib/prisma";

const EQUIPPED_STARTER_SLOTS = ["mainHand", "offHand", "body"];

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

function getCharacterId(req) {
  return Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
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
      characterClass: true,
    },
  });
}

async function handleGet(res, character) {
  const items = await prisma.characterItem.findMany({
    where: { characterId: character.id },
    orderBy: { createdAt: "asc" },
  });

  return res.status(200).json({
    items: items.map(toSafeItem),
  });
}

async function handlePost(req, res, character) {
  const action = typeof req.body?.action === "string" ? req.body.action.trim() : "";

  if (action !== "assignStarterEquipment") {
    return res.status(400).json({
      error: "Unsupported inventory action.",
    });
  }

  const existingItemCount = await prisma.characterItem.count({
    where: { characterId: character.id },
  });

  if (existingItemCount > 0) {
    return res.status(409).json({
      error: "Starter equipment can only be assigned when inventory is empty.",
    });
  }

  const starterEquipment = getStarterEquipmentForClass(character.characterClass);

  if (starterEquipment.length === 0) {
    return res.status(400).json({
      error: "Starter equipment is not available for this character class.",
    });
  }

  const createdItems = await prisma.$transaction(async (tx) => {
    const items = await Promise.all(
      starterEquipment.map((item) =>
        tx.characterItem.create({
          data: {
            characterId: character.id,
            key: item.key,
            name: item.name,
            type: item.type,
            slot: item.slot,
            description: item.description,
            quantity: 1,
            isEquipped: EQUIPPED_STARTER_SLOTS.includes(item.slot),
          },
        }),
      ),
    );

    await createActivityLog(
      {
        characterId: character.id,
        type: "starter_equipment_assigned",
        title: "Starter Equipment Assigned",
        description: "The first tools of the road were gathered.",
        details: {
          characterName: character.name,
          characterClass: character.characterClass,
          itemCount: items.length,
          itemNames: items.map((item) => item.name),
        },
      },
      tx,
    );

    return items;
  });

  return res.status(201).json({
    items: createdItems.map(toSafeItem),
  });
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const character = await getOwnedCharacter(getCharacterId(req), user.id);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    if (req.method === "GET") {
      return handleGet(res, character);
    }

    return handlePost(req, res, character);
  } catch (error) {
    console.error("Character inventory API failed:", error);
    return res.status(500).json({ error: "Inventory request failed." });
  }
}
