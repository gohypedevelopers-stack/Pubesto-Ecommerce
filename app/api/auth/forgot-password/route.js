import { NextResponse } from "next/server";
import { createPasswordReset } from "../../../../lib/auth-store";
import { canUseLocalCustomerAuthFallback, isLocalCustomerAuthMode } from "../../../../lib/auth-mode";
import { isRecoverableShopifyCustomerError, recoverShopifyCustomerPassword } from "../../../../lib/shopify-customer";
import {
  getLocalPasswordResetLinks,
  isValidAuthEmail,
  normalizeAuthEmail,
  readAuthJson,
} from "../../../../lib/auth-validation";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await readAuthJson(request);
    const email = normalizeAuthEmail(body.email);

    if (!isValidAuthEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const message = "If an account exists for that email, password reset instructions are ready.";

    if (!isLocalCustomerAuthMode()) {
      try {
        await recoverShopifyCustomerPassword(email);
        return NextResponse.json({
          success: true,
          message,
          resetUrl: "",
        });
      } catch (error) {
        if (!isRecoverableShopifyCustomerError(error)) {
          return NextResponse.json({ error: error.message || "Could not start password reset." }, { status: 400 });
        }

        if (!canUseLocalCustomerAuthFallback()) {
          return NextResponse.json({ error: "Account service is temporarily unavailable." }, { status: 503 });
        }

        console.error("Shopify password recovery unavailable, using local fallback:", error.message);
      }
    }

    const reset = await createPasswordReset(email);
    const resetLinks = reset ? getLocalPasswordResetLinks(request, reset.token) : {};

    return NextResponse.json({
      success: true,
      message,
      resetPath: resetLinks.resetPath || "",
      resetUrl: resetLinks.resetUrl || "",
    });
  } catch (error) {
    console.error("POST /api/auth/forgot-password error:", error);
    return NextResponse.json({ error: "Could not start password reset." }, { status: 500 });
  }
}
