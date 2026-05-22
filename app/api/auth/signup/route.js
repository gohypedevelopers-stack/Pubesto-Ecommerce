import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createCustomer } from "../../../../lib/auth-store";
import { AUTH_COOKIE_NAME, createSessionToken, getSessionCookieOptions } from "../../../../lib/auth-session";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await createCustomer(body);
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, createSessionToken(user), getSessionCookieOptions());

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Signup failed." }, { status: 400 });
  }
}
