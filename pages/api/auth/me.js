import { getCurrentUser } from "../../../lib/auth/currentUser";
import { clearSessionCookie } from "../../../lib/auth/session";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      clearSessionCookie(res);
      return res.status(401).json({ error: "Not authenticated." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Current user lookup failed:", error);
    return res.status(500).json({ error: "Current user lookup failed." });
  }
}
