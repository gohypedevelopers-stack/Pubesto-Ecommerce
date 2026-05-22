import crypto from "crypto";

export const AUTH_COOKIE_NAME = "pubesto_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value) {
  const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET || process.env.ADMIN_PIN || "pubesto-local-soft-login-secret";
}

function signPayload(payload) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

export function createSessionToken(customer) {
  const payload = base64UrlEncode(JSON.stringify({
    sub: customer.id,
    email: customer.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  }));
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function parseSessionToken(token) {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload);
  const providedSignature = Buffer.from(signature);
  const validSignature = Buffer.from(expectedSignature);
  if (
    providedSignature.length !== validSignature.length ||
    !crypto.timingSafeEqual(providedSignature, validSignature)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(base64UrlDecode(payload));
    if (!session.sub || !session.exp || session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  };
}

export function getClearSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  };
}
