import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCustomerById, updateCustomerProfile } from "../../../lib/auth-store";
import { AUTH_COOKIE_NAME, parseSessionToken } from "../../../lib/auth-session";

export const dynamic = "force-dynamic";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = parseSessionToken(token);
  if (!session) return null;
  return getCustomerById(session.sub);
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}

export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updatedUser = await updateCustomerProfile(user.id, {
    name: body.name,
    phone: body.phone,
    addresses: body.addresses,
  });

  return NextResponse.json({ success: true, user: updatedUser });
}
