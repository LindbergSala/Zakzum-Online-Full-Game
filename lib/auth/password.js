import { compare, hash } from "bcryptjs";

const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_SALT_ROUNDS = 12;

function validatePassword(password) {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
  }
}

export async function hashPassword(password) {
  validatePassword(password);

  return hash(password, PASSWORD_SALT_ROUNDS);
}

export async function verifyPassword(password, passwordHash) {
  if (typeof password !== "string" || typeof passwordHash !== "string") {
    return false;
  }

  return compare(password, passwordHash);
}
