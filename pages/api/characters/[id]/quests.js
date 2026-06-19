import { getCurrentUser } from "../../../../lib/auth/currentUser";
import { getAvailableQuestsForLocation } from "../../../../lib/game/questData";
import {
  getLocationByKey,
  getRealmByKey,
} from "../../../../lib/game/worldLocations";
import prisma from "../../../../lib/prisma";

function toSafeQuest(quest) {
  return {
    key: quest.key,
    title: quest.title,
    type: quest.type,
    startLocationKey: quest.startLocationKey,
    shortDescription: quest.shortDescription,
    briefing: quest.briefing,
    suggestedLevel: quest.suggestedLevel,
    isStarterQuest: quest.isStarterQuest,
    objectives: [...quest.objectives],
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
      currentLocation: true,
    },
  });
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

    const character = await getOwnedCharacter(getCharacterId(req), user.id);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    const location = getLocationByKey(character.currentLocation);
    const realm = location ? getRealmByKey(location.realmKey) : null;
    const quests = getAvailableQuestsForLocation(character.currentLocation);

    return res.status(200).json({
      character: {
        id: character.id,
        name: character.name,
        currentLocation: character.currentLocation,
        currentLocationName: location?.name || character.currentLocation,
        currentRealmKey: location?.realmKey || null,
        currentRealmName: realm?.name || location?.realmKey || null,
      },
      quests: quests.map(toSafeQuest),
    });
  } catch (error) {
    console.error("Character quest API failed:", error);
    return res.status(500).json({ error: "Quest request failed." });
  }
}
