import { NextResponse } from "next/server";
import {
  findDuplicateCancellation,
  makeOrderCancellation,
  readOrderCancellations,
  sanitizeOrderCancellation,
  writeOrderCancellations,
} from "../../../lib/order-cancellations-store";

export const dynamic = "force-dynamic";

function isAdminRequest(request) {
  const adminPin = request.headers.get("x-admin-pin");
  const validPin = process.env.ADMIN_PIN || "pubesto2024";
  return adminPin === validPin;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function validateCancellationPayload(body) {
  if (!String(body.orderId || "").trim()) {
    return "Order ID is required.";
  }
  if (!isValidEmail(body.customerEmail)) {
    return "Please enter a valid email address.";
  }
  if (!String(body.customerName || "").trim()) {
    return "Customer name is required.";
  }
  if (!String(body.reason || "").trim()) {
    return "Cancellation reason is required.";
  }
  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const includeAdmin = isAdminRequest(request);
    const cancellations = await readOrderCancellations();

    if (id) {
      const found = cancellations.find((cancellation) => cancellation.id === id);
      if (!found) {
        return NextResponse.json({ error: "Cancellation request not found." }, { status: 404 });
      }

      return NextResponse.json(sanitizeOrderCancellation(found, { includeAdmin }));
    }

    if (!includeAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = status && status !== "all"
      ? cancellations.filter((cancellation) => cancellation.status === status)
      : cancellations;

    return NextResponse.json(results.map((cancellation) => sanitizeOrderCancellation(cancellation, { includeAdmin })));
  } catch (error) {
    console.error("GET /api/order-cancellations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validationError = validateCancellationPayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const cancellations = await readOrderCancellations();
    const duplicate = findDuplicateCancellation(cancellations, {
      orderId: body.orderId,
      customerEmail: body.customerEmail,
    });

    if (duplicate) {
      return NextResponse.json(
        {
          error: "A cancellation request for this order already exists.",
          existingId: duplicate.id,
        },
        { status: 409 }
      );
    }

    const cancellation = makeOrderCancellation(body);
    await writeOrderCancellations([...cancellations, cancellation]);

    return NextResponse.json(
      {
        success: true,
        cancellationId: cancellation.id,
        request: sanitizeOrderCancellation(cancellation),
        message: "Cancellation request submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/order-cancellations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
