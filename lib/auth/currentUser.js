import prisma from "../prisma";
import { getSessionFromRequest } from "./session";

function toSafeUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getCurrentUser(req) {
  const session = await getSessionFromRequest(req);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });

  return user ? toSafeUser(user) : null;
}
