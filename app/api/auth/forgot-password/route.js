import { NextResponse } from "next/server";
import { createPasswordReset } from "../../../../lib/auth-store";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { email } = await request.json();
    const reset = await createPasswordReset(email);
    const resetUrl = reset
      ? `/account/reset?token=${encodeURIComponent(reset.token)}`
      : "";

    return NextResponse.json({
      success: true,
      message: "If an account exists for that email, password reset instructions are ready.",
      resetUrl,
    });
  } catch (error) {
    console.error("POST /api/auth/forgot-password error:", error);
    return NextResponse.json({ error: "Could not start password reset." }, { status: 500 });
  }
}
