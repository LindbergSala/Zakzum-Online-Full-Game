import { getCurrentUser } from "../../../../lib/auth/currentUser";
import { createActivityLog } from "../../../../lib/game/activityLog";
import {
  getAvailableQuestsForLocation,
  getQuestByKey,
} from "../../../../lib/game/questData";
import {
  getLocationByKey,
  getRealmByKey,
} from "../../../../lib/game/worldLocations";
import prisma from "../../../../lib/prisma";

function toSafeQuestDetails(quest) {
  return {
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

function toSafeQuest(quest) {
  return {
    key: quest.key,
    ...toSafeQuestDetails(quest),
  };
}

function toSafeQuestProgress(progress) {
  if (!progress) {
    return {
      status: "AVAILABLE",
      acceptedAt: null,
      completedAt: null,
      failedAt: null,
    };
  }

  return {
    status: progress.status,
    acceptedAt: progress.acceptedAt.toISOString(),
    completedAt: progress.completedAt?.toISOString() || null,
    failedAt: progress.failedAt?.toISOString() || null,
  };
}

function getCharacterId(req) {
  return Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
}

function getQuestKey(req) {
  return typeof req.body?.questKey === "string" ? req.body.questKey.trim() : "";
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

async function handleGet(res, character) {
  const location = getLocationByKey(character.currentLocation);
  const realm = location ? getRealmByKey(location.realmKey) : null;
  const quests = getAvailableQuestsForLocation(character.currentLocation);
  const questKeys = quests.map((quest) => quest.key);
  const progressRows = questKeys.length
    ? await prisma.characterQuest.findMany({
        where: {
          characterId: character.id,
          questKey: { in: questKeys },
        },
        select: {
          questKey: true,
          status: true,
          acceptedAt: true,
          completedAt: true,
          failedAt: true,
        },
      })
    : [];
  const progressByQuestKey = new Map(
    progressRows.map((progress) => [progress.questKey, progress]),
  );

  return res.status(200).json({
    character: {
      id: character.id,
      name: character.name,
      currentLocation: character.currentLocation,
      currentLocationName: location?.name || character.currentLocation,
      currentRealmKey: location?.realmKey || null,
      currentRealmName: realm?.name || location?.realmKey || null,
    },
    quests: quests.map((quest) => ({
      ...toSafeQuest(quest),
      progress: toSafeQuestProgress(progressByQuestKey.get(quest.key)),
    })),
  });
}

async function handlePost(req, res, character) {
  const questKey = getQuestKey(req);

  if (!questKey) {
    return res.status(400).json({ error: "Quest key is required." });
  }

  const quest = getQuestByKey(questKey);

  if (!quest) {
    return res.status(400).json({ error: "Quest key is invalid." });
  }

  const availableQuests = getAvailableQuestsForLocation(
    character.currentLocation,
  );
  const isAvailable = availableQuests.some(
    (availableQuest) => availableQuest.key === quest.key,
  );

  if (!isAvailable) {
    return res.status(400).json({
      error: "This quest is not available at the character's current location.",
    });
  }

  const existingQuest = await prisma.characterQuest.findUnique({
    where: {
      characterId_questKey: {
        characterId: character.id,
        questKey: quest.key,
      },
    },
    select: { id: true },
  });

  if (existingQuest) {
    return res.status(409).json({
      error: "This character has already accepted that quest.",
    });
  }

  try {
    const acceptedQuest = await prisma.$transaction(async (tx) => {
      const characterQuest = await tx.characterQuest.create({
        data: {
          characterId: character.id,
          questKey: quest.key,
          status: "ACCEPTED",
        },
        select: {
          id: true,
          questKey: true,
          status: true,
          acceptedAt: true,
        },
      });

      await createActivityLog(
        {
          characterId: character.id,
          type: "quest_accepted",
          title: "Quest Accepted",
          description: "A new duty was written into the road ahead.",
          details: {
            characterName: character.name,
            questKey: quest.key,
            questTitle: quest.title,
            questType: quest.type,
            startLocationKey: quest.startLocationKey,
            currentLocationKey: character.currentLocation,
            status: characterQuest.status,
          },
        },
        tx,
      );

      return characterQuest;
    });

    return res.status(201).json({
      character: {
        id: character.id,
        name: character.name,
      },
      acceptedQuest: {
        id: acceptedQuest.id,
        questKey: acceptedQuest.questKey,
        status: acceptedQuest.status,
        acceptedAt: acceptedQuest.acceptedAt.toISOString(),
        ...toSafeQuestDetails(quest),
      },
    });
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        error: "This character has already accepted that quest.",
      });
    }

    throw error;
  }
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
    console.error("Character quest API failed:", error);
    return res.status(500).json({ error: "Quest request failed." });
  }
}
