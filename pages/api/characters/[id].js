import prisma from "../../../lib/prisma";
import { getCurrentUser } from "../../../lib/auth/currentUser";

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
    updatedAt: character.updatedAt.toISOString(),
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const characterId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

    if (!characterId) {
      return res.status(404).json({ error: "Character not found." });
    }

    const character = await prisma.character.findFirst({
      where: {
        id: characterId,
        userId: user.id,
      },
    });

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    return res.status(200).json({
      character: toSafeCharacter(character),
    });
  } catch (error) {
    console.error("Character detail API failed:", error);
    return res.status(500).json({ error: "Character request failed." });
  }
}
