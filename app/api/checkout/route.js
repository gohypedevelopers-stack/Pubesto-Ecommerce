import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'my-store-300000000000000009154.myshopify.com';
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!adminToken) {
      console.warn("SHOPIFY_ADMIN_ACCESS_TOKEN is not set. Bypassing to storefront checkout.");
      return NextResponse.json({ fallback: true });
    }

    // Prepare line items for Shopify Draft Order
    const lineItems = items.map(item => {
      const line = {
        quantity: item.quantity,
      };

      const price = Number(item.discountedUnitPrice || item.price) || 0;

      if (item.variantId && String(item.variantId).includes("gid://shopify/")) {
        line.variantId = item.variantId;
        // Use priceOverride to set the exact dynamic bundle price
        line.priceOverride = {
          amount: String(price.toFixed(2)),
          currencyCode: "INR"
        };
      } else {
        // Fallback to custom item if no Shopify variant ID exists
        line.title = item.name;
        line.originalUnitPrice = String(price.toFixed(2));
      }

      return line;
    });

    const totalAmount = items.reduce((sum, item) => {
      const price = Number(item.discountedUnitPrice || item.price) || 0;
      return sum + (price * item.quantity);
    }, 0);

    const shippingLine = totalAmount >= 999 ? {
      title: "Free Priority Shipping",
      price: "0.00"
    } : {
      title: "Standard Shipping",
      price: "99.00"
    };

    const query = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            invoiceUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(`https://${domain}/admin/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            lineItems,
            shippingLine,
          }
        }
      })
    });

    const resJson = await response.json();

    if (resJson.errors) {
      console.error("Shopify GraphQL Errors:", resJson.errors);
      return NextResponse.json({ fallback: true, errors: resJson.errors });
    }

    const draftOrderData = resJson.data?.draftOrderCreate;
    if (draftOrderData?.userErrors && draftOrderData.userErrors.length > 0) {
      console.error("Shopify User Errors:", draftOrderData.userErrors);
      return NextResponse.json({ fallback: true, userErrors: draftOrderData.userErrors });
    }

    const checkoutUrl = draftOrderData?.draftOrder?.invoiceUrl;
    if (!checkoutUrl) {
      console.error("No invoiceUrl returned from draftOrderCreate");
      return NextResponse.json({ fallback: true });
    }

    return NextResponse.json({ checkoutUrl });

  } catch (error) {
    console.error("Checkout API route error:", error);
    return NextResponse.json({ fallback: true, error: error.message });
  }
}
