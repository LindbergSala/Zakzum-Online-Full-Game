import prisma from "../../../lib/prisma";
import { hashPassword } from "../../../lib/auth/password";

function getRegisterInput(body) {
  return {
    email: typeof body?.email === "string" ? body.email.trim().toLowerCase() : "",
    username: typeof body?.username === "string" ? body.username.trim() : "",
    password: typeof body?.password === "string" ? body.password : "",
  };
}

function validateRegisterInput({ email, username, password }) {
  if (!email) {
    return "Email is required.";
  }

  if (!email.includes("@")) {
    return "Email must be valid.";
  }

  if (!username) {
    return "Username is required.";
  }

  if (username.length < 3) {
    return "Username must be at least 3 characters long.";
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

  const input = getRegisterInput(req.body);
  const validationError = validateRegisterInput(input);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { username: input.username }],
    },
    select: {
      email: true,
      username: true,
    },
  });

  if (existingUser) {
    return res.status(409).json({
      error: "An account with that email or username already exists.",
    });
  }

  try {
    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ user: toSafeUser(user) });
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        error: "An account with that email or username already exists.",
      });
    }

    console.error("Registration failed:", error);
    return res.status(500).json({ error: "Registration failed." });
  }
}
