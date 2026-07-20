import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "nk_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing SESSION_SECRET environment variable.");
  }
  return secret;
}

export async function verifyPassword(candidate) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    throw new Error("Missing ADMIN_PASSWORD_HASH environment variable.");
  }
  return bcrypt.compare(candidate, hash);
}

export function createSessionToken() {
  return jwt.sign({ role: "admin" }, getSecret(), {
    expiresIn: SESSION_TTL_SECONDS
  });
}

export function verifySessionToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS
};
