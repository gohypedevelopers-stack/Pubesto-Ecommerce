import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createCustomer } from "../../../../lib/auth-store";
import { canUseLocalCustomerAuthFallback } from "../../../../lib/auth-mode";
import { AUTH_COOKIE_NAME, createSessionToken, getSessionCookieOptions } from "../../../../lib/auth-session";
import { createShopifyCustomer, isRecoverableShopifyCustomerError } from "../../../../lib/shopify-customer";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    let authResult;

    try {
      authResult = await createShopifyCustomer(body);
    } catch (error) {
      if (!isRecoverableShopifyCustomerError(error)) {
        return NextResponse.json({ error: error.message || "Signup failed." }, { status: 400 });
      }

      if (!canUseLocalCustomerAuthFallback()) {
        return NextResponse.json({ error: "Account service is temporarily unavailable." }, { status: 503 });
      }

      console.error("Shopify customer signup unavailable, using local fallback:", error.message);
      const user = await createCustomer(body);
      authResult = { user };
    }

    const cookieStore = await cookies();
    cookieStore.set(
      AUTH_COOKIE_NAME,
      createSessionToken(authResult.user, {
        provider: authResult.customerAccessToken ? "shopify" : "local",
        customerAccessToken: authResult.customerAccessToken,
        expiresAt: authResult.expiresAt,
      }),
      getSessionCookieOptions()
    );

    return NextResponse.json({ success: true, user: authResult.user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Signup failed." }, { status: 400 });
  }
}
