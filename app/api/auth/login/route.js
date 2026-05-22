import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyCustomerLogin } from "../../../../lib/auth-store";
import { AUTH_COOKIE_NAME, createSessionToken, getSessionCookieOptions } from "../../../../lib/auth-session";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await verifyCustomerLogin(body);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, createSessionToken(user), getSessionCookieOptions());

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
