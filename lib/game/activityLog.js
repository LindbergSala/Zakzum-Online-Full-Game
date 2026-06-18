import prisma from "../prisma";

export async function createActivityLog(
  { characterId, type, title, description, details },
  client = prisma,
) {
  return client.activityLog.create({
    data: {
      characterId,
      type,
      title,
      description,
      details,
    },
  });
}
