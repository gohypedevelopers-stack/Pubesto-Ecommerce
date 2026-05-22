import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCustomerById } from "../../../../lib/auth-store";
import { AUTH_COOKIE_NAME, parseSessionToken } from "../../../../lib/auth-session";
import { getShopifyCustomer } from "../../../../lib/shopify-customer";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = parseSessionToken(token);

  if (!session) {
    return NextResponse.json({ user: null });
  }

  if (session.provider === "shopify" && session.customerAccessToken) {
    try {
      const user = await getShopifyCustomer(session.customerAccessToken);
      return NextResponse.json({ user });
    } catch (error) {
      console.error("GET /api/auth/session Shopify error:", error);
      return NextResponse.json({ user: null });
    }
  }

  const user = await getCustomerById(session.sub);
  return NextResponse.json({ user });
}
