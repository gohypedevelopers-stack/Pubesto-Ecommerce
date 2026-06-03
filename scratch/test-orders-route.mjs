import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  }
}

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'jjiygt-gt.myshopify.com';
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const email = "pubesto.in@gmail.com";

console.log("Domain:", domain);

const query = `
  query getOrders($query: String!) {
    orders(first: 50, query: $query) {
      edges {
        node {
          id
          name
          createdAt
          cancelledAt
          displayFinancialStatus
          displayFulfillmentStatus
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

async function run() {
  try {
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

    console.log("Response status:", response.status, response.statusText);
    const resJson = await response.json();
    if (resJson.errors) {
      console.error("Shopify errors:", resJson.errors);
      return;
    }

    const ordersEdges = resJson.data?.orders?.edges || [];
    console.log(`Found ${ordersEdges.length} orders.`);

    for (const { node } of ordersEdges) {
      console.log("Order name:", node.name);
      console.log("Display financial status:", node.displayFinancialStatus);
      console.log("Display fulfillment status:", node.displayFulfillmentStatus);
    }
  } catch (error) {
    console.error("Run error:", error);
  }
}

run();
