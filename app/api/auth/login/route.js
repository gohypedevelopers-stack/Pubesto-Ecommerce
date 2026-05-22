import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyCustomerLogin } from "../../../../lib/auth-store";
import { canUseLocalCustomerAuthFallback } from "../../../../lib/auth-mode";
import { AUTH_COOKIE_NAME, createSessionToken, getSessionCookieOptions } from "../../../../lib/auth-session";
import { isRecoverableShopifyCustomerError, loginShopifyCustomer } from "../../../../lib/shopify-customer";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    let authResult = null;
    const allowLocalFallback = canUseLocalCustomerAuthFallback();

    try {
      authResult = await loginShopifyCustomer(body);
    } catch (error) {
      if (isRecoverableShopifyCustomerError(error) && !allowLocalFallback) {
        return NextResponse.json({ error: "Account service is temporarily unavailable." }, { status: 503 });
      }

      if (!isRecoverableShopifyCustomerError(error) && allowLocalFallback) {
        const localUser = await verifyCustomerLogin(body);
        if (localUser) {
          authResult = { user: localUser };
        }
      } else if (isRecoverableShopifyCustomerError(error)) {
        console.error("Shopify customer login unavailable, using local fallback:", error.message);
      }
    }

    if (!authResult && allowLocalFallback) {
      const localUser = await verifyCustomerLogin(body);
      if (localUser) {
        authResult = { user: localUser };
      }
    }

    if (!authResult?.user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
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

    return NextResponse.json({ success: true, user: authResult.user });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
