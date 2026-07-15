import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createSessionToken, getSessionCookieOptions } from "../../../../../lib/auth-session";
import {
  exchangeGoogleCode,
  fetchGoogleProfile,
  getGoogleAuthConfig,
  getSafeAuthRedirect,
  GOOGLE_OAUTH_REDIRECT_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
} from "../../../../../lib/google-auth";

export const dynamic = "force-dynamic";

const CLEAR_GOOGLE_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 0,
  path: "/",
};

function loginRedirect(request, error) {
  const loginUrl = new URL("/account/login", request.url);
  if (error) {
    loginUrl.searchParams.set("authError", error);
  }
  return loginUrl;
}

function clearGoogleCookies(response) {
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, "", CLEAR_GOOGLE_COOKIE_OPTIONS);
  response.cookies.set(GOOGLE_OAUTH_REDIRECT_COOKIE, "", CLEAR_GOOGLE_COOKIE_OPTIONS);
}

function getStoredRedirect(rawValue) {
  try {
    return getSafeAuthRedirect(decodeURIComponent(rawValue || ""));
  } catch {
    return "/account";
  }
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const error = requestUrl.searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
  const redirectTo = getStoredRedirect(cookieStore.get(GOOGLE_OAUTH_REDIRECT_COOKIE)?.value);

  if (error) {
    const response = NextResponse.redirect(loginRedirect(request, "google_denied"));
    clearGoogleCookies(response);
    return response;
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    const response = NextResponse.redirect(loginRedirect(request, "google_state"));
    clearGoogleCookies(response);
    return response;
  }

  try {
    let profile;
    const isLocalhost = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
    const isDev = process.env.NODE_ENV !== "production" || isLocalhost;

    if (code === "mock_code" && isDev) {
      profile = {
        sub: "mock_google_user_123456",
        name: "Test Google User",
        email: "test.google.user@example.com",
        picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      };
    } else {
      const { clientId, clientSecret, redirectUri } = getGoogleAuthConfig(request);
      if (!clientId || !clientSecret) {
        throw new Error("Google OAuth is not configured.");
      }

      const tokenData = await exchangeGoogleCode({ code, clientId, clientSecret, redirectUri });
      profile = await fetchGoogleProfile(tokenData.access_token);
    }

    const response = NextResponse.redirect(loginRedirect(request, "Google OAuth is disabled when using strict Shopify authentication. Please use standard email and password to log in or create an account."));
    clearGoogleCookies(response);
    return response;
  } catch (callbackError) {
    console.error("GET /api/auth/google/callback error:", callbackError);
    const response = NextResponse.redirect(loginRedirect(request, "google_failed"));
    clearGoogleCookies(response);
    return response;
  }
}
