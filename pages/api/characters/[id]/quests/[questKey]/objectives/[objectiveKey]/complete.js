import { getCurrentUser } from "../../../../../../../../lib/auth/currentUser";
import { createActivityLog } from "../../../../../../../../lib/game/activityLog";
import { getQuestByKey } from "../../../../../../../../lib/game/questData";
import { getQuestObjectives } from "../../../../../../../../lib/game/questObjectiveRules";
import prisma from "../../../../../../../../lib/prisma";

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function getQuestStatusError(status) {
  switch (status) {
    case "COMPLETED":
      return "Objectives cannot be completed after the quest is completed.";
    case "FAILED":
      return "Objectives cannot be completed for a failed quest.";
    default:
      return "The quest must be accepted before objectives can be completed.";
  }
}

function toSafeObjective(progress, objective) {
  return {
    id: progress.id,
    objectiveKey: progress.objectiveKey,
    text: objective.text,
    isRequired: objective.isRequired,
    isCompleted: progress.isCompleted,
    completedAt: progress.completedAt?.toISOString() || null,
  };
}

function toSafeResponse(character, quest, objective, progress, message) {
  return {
    character: {
      id: character.id,
      name: character.name,
    },
    questKey: quest.key,
    objective: toSafeObjective(progress, objective),
    message,
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

function createQuestStatusConflict(status) {
  const error = new Error("Quest status changed during objective completion.");
  error.code = "OBJECTIVE_QUEST_STATUS_CONFLICT";
  error.questStatus = status;
  return error;
}

async function completeObjective({ character, characterQuest, quest, objective }) {
  const completedAt = new Date();

  try {
    return await prisma.$transaction(async (tx) => {
      const currentQuest = await tx.characterQuest.findUnique({
        where: { id: characterQuest.id },
        select: { status: true },
      });

      if (currentQuest?.status !== "ACCEPTED") {
        throw createQuestStatusConflict(currentQuest?.status);
      }

      const updateResult = await tx.characterQuestObjective.updateMany({
        where: {
          characterQuestId: characterQuest.id,
          objectiveKey: objective.key,
          isCompleted: false,
        },
        data: {
          isCompleted: true,
          completedAt,
        },
      });

      let progress = await tx.characterQuestObjective.findUnique({
        where: {
          characterQuestId_objectiveKey: {
            characterQuestId: characterQuest.id,
            objectiveKey: objective.key,
          },
        },
      });
      let newlyCompleted = updateResult.count === 1;

      if (!progress) {
        progress = await tx.characterQuestObjective.create({
          data: {
            characterQuestId: characterQuest.id,
            objectiveKey: objective.key,
            isCompleted: true,
            completedAt,
          },
        });
        newlyCompleted = true;
      }

      if (newlyCompleted) {
        await createActivityLog(
          {
            characterId: character.id,
            type: "objective_completed",
            title: "Objective Completed",
            description: "A step of the duty was marked as fulfilled.",
            details: {
              characterName: character.name,
              questKey: quest.key,
              questTitle: quest.title,
              questType: quest.type,
              objectiveKey: objective.key,
              objectiveText: objective.text,
              isRequired: objective.isRequired,
              status: "COMPLETED",
              completedAt: progress.completedAt.toISOString(),
            },
          },
          tx,
        );
      }

      return { progress, newlyCompleted };
    });
  } catch (error) {
    if (error?.code === "P2002") {
      const progress = await prisma.characterQuestObjective.findUnique({
        where: {
          characterQuestId_objectiveKey: {
            characterQuestId: characterQuest.id,
            objectiveKey: objective.key,
          },
        },
      });

      if (progress?.isCompleted) {
        return { progress, newlyCompleted: false };
      }
    }

    throw error;
  }
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
    const objectiveKey = getQueryValue(req.query.objectiveKey);
    const character = await getOwnedCharacter(characterId, user.id);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    const quest = getQuestByKey(questKey);

    if (!quest) {
      return res.status(400).json({ error: "Quest key is invalid." });
    }

    const objective = getQuestObjectives(quest).find(
      (candidate) => candidate.key === objectiveKey,
    );

    if (!objective) {
      return res.status(400).json({ error: "Objective key is invalid." });
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
        status: true,
      },
    });

    if (!characterQuest) {
      return res.status(400).json({
        error: "The quest must be accepted before objectives can be completed.",
      });
    }

    if (characterQuest.status !== "ACCEPTED") {
      return res.status(409).json({
        error: getQuestStatusError(characterQuest.status),
      });
    }

    try {
      const result = await completeObjective({
        character,
        characterQuest,
        quest,
        objective,
      });

      return res.status(200).json(
        toSafeResponse(
          character,
          quest,
          objective,
          result.progress,
          result.newlyCompleted
            ? "Objective completed."
            : "Objective was already completed.",
        ),
      );
    } catch (error) {
      if (error?.code === "OBJECTIVE_QUEST_STATUS_CONFLICT") {
        return res.status(409).json({
          error: getQuestStatusError(error.questStatus),
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("Character quest objective API failed:", error);
    return res.status(500).json({ error: "Objective completion failed." });
  }
}
