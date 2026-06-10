import prisma from "../../../lib/prisma";
import { clearSessionCookie, getSessionFromRequest } from "../../../lib/auth/session";

function toSafeUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const session = await getSessionFromRequest(req);

    if (!session) {
      return res.status(401).json({ error: "Not authenticated." });
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

    if (!user) {
      clearSessionCookie(res);
      return res.status(401).json({ error: "Not authenticated." });
    }

    return res.status(200).json({ user: toSafeUser(user) });
  } catch (error) {
    console.error("Current user lookup failed:", error);
    return res.status(500).json({ error: "Current user lookup failed." });
  }
}
