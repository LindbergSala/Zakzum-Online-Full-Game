import { getCurrentUser } from "../../../../lib/auth/currentUser";
import prisma from "../../../../lib/prisma";

function toSafeActivityLog(activityLog) {
  return {
    id: activityLog.id,
    type: activityLog.type,
    title: activityLog.title,
    description: activityLog.description,
    details: activityLog.details,
    createdAt: activityLog.createdAt.toISOString(),
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

    const activityLogs = await prisma.activityLog.findMany({
      where: { characterId: character.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      activityLogs: activityLogs.map(toSafeActivityLog),
    });
  } catch (error) {
    console.error("Character activity log API failed:", error);
    return res.status(500).json({ error: "Activity log request failed." });
  }
}
