import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCustomerById } from "../../../../lib/auth-store";
import { AUTH_COOKIE_NAME, parseSessionToken } from "../../../../lib/auth-session";
import { getShopifyCustomer } from "../../../../lib/shopify-customer";

export const dynamic = "force-dynamic";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = parseSessionToken(token);
  if (!session) return null;

  if (session.provider === "shopify" && session.customerAccessToken) {
    const user = await getShopifyCustomer(session.customerAccessToken);
    return user ? { user, session } : null;
  }

  const user = await getCustomerById(session.sub);
  return user ? { user, session } : null;
}

export async function GET() {
  try {
    const account = await getCurrentUser();
    if (!account?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = account.user.email;
    if (!email) {
      return NextResponse.json({ error: "No email associated with this account." }, { status: 400 });
    }

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'my-store-300000000000000009154.myshopify.com';
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!adminToken) {
      return NextResponse.json({ error: "Shopify integration not fully configured." }, { status: 500 });
    }

    const query = `
      query getOrders($query: String!) {
        orders(first: 50, query: $query) {
          edges {
            node {
              id
              name
              createdAt
              cancelledAt
              financialStatus
              fulfillmentStatus
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              subtotalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              totalShippingPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      id
                      title
                      price
                      image {
                        url
                      }
                      product {
                        handle
                        featuredImage {
                          url
                        }
                        images(first: 1) {
                          edges {
                            node {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
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
          query: `email:${email}`
        }
      }),
      cache: "no-store",
    });

    const resJson = await response.json();

    if (resJson.errors) {
      console.error("Shopify orders query errors:", resJson.errors);
      return NextResponse.json({ error: "Failed to fetch orders from Shopify." }, { status: 500 });
    }

    const ordersEdges = resJson.data?.orders?.edges || [];

    const mappedOrders = ordersEdges.map(({ node }) => {
      const subtotal = parseFloat(node.subtotalPriceSet?.shopMoney?.amount || 0);
      const shipping = parseFloat(node.totalShippingPriceSet?.shopMoney?.amount || 0);
      const total = parseFloat(node.totalPriceSet?.shopMoney?.amount || 0);

      // Determine order status
      let status = "processing";
      if (node.cancelledAt) {
        status = "cancelled";
      } else if (node.fulfillmentStatus === "FULFILLED") {
        status = "delivered";
      } else if (node.fulfillmentStatus === "PARTIALLY_FULFILLED" || node.fulfillmentStatus === "RESTOCKED") {
        status = "shipped";
      } else {
        status = "processing";
      }

      // Map payment status
      let paymentStatus = "unpaid";
      if (node.financialStatus === "PAID") {
        paymentStatus = "paid";
      }

      const items = (node.lineItems?.edges || []).map(({ node: item }) => {
        const variant = item.variant;
        const slug = variant?.product?.handle || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const priceNumber = parseFloat(variant?.price || 0);
        
        let color = null;
        if (variant?.title && variant.title !== "Default Title" && variant.title !== "Default") {
          color = variant.title;
        }

        let image = "/images/products/neck-fan.png";
        if (variant?.image?.url) {
          image = variant.image.url;
        } else if (variant?.product?.featuredImage?.url) {
          image = variant.product.featuredImage.url;
        } else if (variant?.product?.images?.edges?.[0]?.node?.url) {
          image = variant.product.images.edges[0].node.url;
        }

        return {
          id: variant?.id || slug,
          name: item.title,
          image,
          price: `Rs. ${priceNumber.toLocaleString("en-IN")}`,
          priceNumber,
          quantity: item.quantity,
          slug,
          color,
        };
      });

      return {
        id: node.name, // e.g. "PUB-2026-7215"
        date: node.createdAt,
        items,
        subtotal,
        shipping,
        total,
        status,
        paymentStatus,
        paymentId: node.id, // Shopify internal GraphQL ID
      };
    });

    return NextResponse.json({ orders: mappedOrders });

  } catch (error) {
    console.error("GET /api/account/orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
