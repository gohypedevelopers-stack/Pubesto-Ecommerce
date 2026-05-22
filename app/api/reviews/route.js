import { NextResponse } from "next/server";
import {
  filterReviews,
  makeReview,
  readReviews,
  summarizeReviews,
  writeReviews,
} from "../../../lib/reviews-store";

export const dynamic = "force-dynamic";

function isAdminRequest(request) {
  const adminPin = request.headers.get("x-admin-pin");
  const validPin = process.env.ADMIN_PIN || "pubesto2024";
  return adminPin === validPin;
}

function validateReviewPayload(body) {
  if (!String(body.customerName || "").trim()) {
    return "Customer name is required.";
  }
  if (!String(body.text || "").trim()) {
    return "Review text is required.";
  }
  const rating = Number(body.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5.";
  }
  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");
    const productSlug = searchParams.get("productSlug");
    const isAdmin = isAdminRequest(request);
    const reviews = await readReviews();
    const filtered = filterReviews(reviews, {
      scope,
      productSlug,
      includeUnpublished: isAdmin,
    });

    return NextResponse.json({
      reviews: filtered,
      summary: summarizeReviews(filtered),
    });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationError = validateReviewPayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const reviews = await readReviews();
    const review = makeReview(body);
    const savedReviews = await writeReviews([...reviews, review]);

    return NextResponse.json(
      {
        success: true,
        review,
        summary: summarizeReviews(savedReviews),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
