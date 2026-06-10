import prisma from "../../../lib/prisma";
import { verifyPassword } from "../../../lib/auth/password";
import { createSessionToken, setSessionCookie } from "../../../lib/auth/session";

const INVALID_CREDENTIALS_MESSAGE = "Invalid identifier or password.";

function getLoginInput(body) {
  const rawIdentifier = typeof body?.identifier === "string" ? body.identifier.trim() : "";
  const isEmail = rawIdentifier.includes("@");

  return {
    identifier: isEmail ? rawIdentifier.toLowerCase() : rawIdentifier,
    isEmail,
    password: typeof body?.password === "string" ? body.password : "",
  };
}

function validateLoginInput({ identifier, password }) {
  if (!identifier) {
    return "Identifier is required.";
  }

  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  return null;
}

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
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  const input = getLoginInput(req.body);
  const validationError = validateLoginInput(input);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const user = await prisma.user.findFirst({
      where: input.isEmail
        ? { email: input.identifier }
        : { username: input.identifier },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: INVALID_CREDENTIALS_MESSAGE });
    }

    const passwordIsValid = await verifyPassword(input.password, user.passwordHash);

    if (!passwordIsValid) {
      return res.status(401).json({ error: INVALID_CREDENTIALS_MESSAGE });
    }

    const sessionToken = await createSessionToken(user);
    setSessionCookie(res, sessionToken);

    return res.status(200).json({ user: toSafeUser(user) });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ error: "Login failed." });
  }
}
