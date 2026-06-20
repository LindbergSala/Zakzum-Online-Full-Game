import { getCurrentUser } from "../../../../../../lib/auth/currentUser";
import { createActivityLog } from "../../../../../../lib/game/activityLog";
import { getQuestCompletionValidationError } from "../../../../../../lib/game/questCompletionRules";
import { getQuestByKey } from "../../../../../../lib/game/questData";
import prisma from "../../../../../../lib/prisma";

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const characterId = getQueryValue(req.query.id);
    const questKey = getQueryValue(req.query.questKey);
    const character = await getOwnedCharacter(characterId, user.id);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    const quest = getQuestByKey(questKey);

    if (!quest) {
      return res.status(400).json({ error: "Quest key is invalid." });
    }

    const characterQuest = await prisma.characterQuest.findUnique({
      where: {
        characterId_questKey: {
          characterId: character.id,
          questKey: quest.key,
        },
      },
      select: {
        id: true,
        questKey: true,
        status: true,
        acceptedAt: true,
        completedAt: true,
        failedAt: true,
      },
    });

    if (!characterQuest) {
      return res.status(400).json({
        error: "The quest must be accepted before it can be completed.",
      });
    }

    const validationError = getQuestCompletionValidationError({
      quest,
      progress: characterQuest,
      character,
    });

    if (validationError) {
      return res.status(409).json({ error: validationError });
    }

    const completedAt = new Date();

    try {
      const completedQuest = await prisma.$transaction(async (tx) => {
        const updateResult = await tx.characterQuest.updateMany({
          where: {
            id: characterQuest.id,
            status: "ACCEPTED",
          },
          data: {
            status: "COMPLETED",
            completedAt,
          },
        });

        if (updateResult.count !== 1) {
          const completionConflict = new Error("Quest completion conflict.");
          completionConflict.code = "QUEST_COMPLETION_CONFLICT";
          throw completionConflict;
        }

        const updatedQuest = await tx.characterQuest.findUnique({
          where: { id: characterQuest.id },
          select: {
            id: true,
            questKey: true,
            status: true,
            acceptedAt: true,
            completedAt: true,
          },
        });

        await createActivityLog(
          {
            characterId: character.id,
            type: "quest_completed",
            title: "Quest Completed",
            description: "A duty was fulfilled and written into memory.",
            details: {
              characterName: character.name,
              questKey: quest.key,
              questTitle: quest.title,
              questType: quest.type,
              startLocationKey: quest.startLocationKey,
              previousStatus: characterQuest.status,
              status: updatedQuest.status,
              acceptedAt: characterQuest.acceptedAt.toISOString(),
              completedAt: updatedQuest.completedAt.toISOString(),
            },
          },
          tx,
        );

        return updatedQuest;
      });

      return res.status(200).json({
        character: {
          id: character.id,
          name: character.name,
        },
        completedQuest: {
          id: completedQuest.id,
          questKey: completedQuest.questKey,
          status: completedQuest.status,
          acceptedAt: completedQuest.acceptedAt.toISOString(),
          completedAt: completedQuest.completedAt.toISOString(),
          ...toSafeQuestDetails(quest),
        },
      });
    } catch (error) {
      if (error?.code === "QUEST_COMPLETION_CONFLICT") {
        return res.status(409).json({
          error: "This quest can no longer be completed.",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("Character quest completion API failed:", error);
    return res.status(500).json({ error: "Quest completion failed." });
  }
}
