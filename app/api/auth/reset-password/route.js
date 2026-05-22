import { NextResponse } from "next/server";
import { resetCustomerPassword } from "../../../../lib/auth-store";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await resetCustomerPassword(body);

    if (!user) {
      return NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not reset password." }, { status: 400 });
  }
}
