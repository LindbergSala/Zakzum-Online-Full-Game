import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "zakzum_session";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const SESSION_ISSUER = "zakzum-online";
const SESSION_AUDIENCE = "zakzum-online-auth";

function getSessionSecretKey() {
  const secret = process.env.AUTH_SESSION_SECRET;

  if (!secret) {
    throw new Error("AUTH_SESSION_SECRET is required for session cookies.");
  }

  return new TextEncoder().encode(secret);
}

function parseCookieHeader(cookieHeader) {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [name, ...valueParts] = cookie.trim().split("=");

    if (!name) {
      return cookies;
    }

    cookies[name] = decodeURIComponent(valueParts.join("="));
    return cookies;
  }, {});
}

function serializeSessionCookie(value, options = {}) {
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
  ];

  if (options.maxAge !== undefined) {
    cookieParts.push(`Max-Age=${options.maxAge}`);
  }

  if (options.expires) {
    cookieParts.push(`Expires=${options.expires.toUTCString()}`);
  }

  if (process.env.NODE_ENV === "production") {
    cookieParts.push("Secure");
  }

  return cookieParts.join("; ");
}

export async function createSessionToken(user) {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecretKey());
}

export async function verifySessionToken(token) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSessionSecretKey(), {
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.username !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(req) {
  const cookies = parseCookieHeader(req.headers.cookie);
  return verifySessionToken(cookies[SESSION_COOKIE_NAME]);
}

export function setSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    serializeSessionCookie(token, { maxAge: SESSION_DURATION_SECONDS }),
  );
}

export function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    serializeSessionCookie("", { maxAge: 0, expires: new Date(0) }),
  );
}
