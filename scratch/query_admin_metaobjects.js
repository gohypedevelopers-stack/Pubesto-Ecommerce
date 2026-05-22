const shop = "my-store-300000000000000009154.myshopify.com";
const adminToken = "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";

async function run() {
  // Querying all metaobject definitions via Admin GraphQL API
  const url = `https://${shop}/admin/api/2023-10/graphql.json`;
  const query = `
    {
      metaobjectDefinitions(first: 50) {
        edges {
          node {
            name
            type
            fieldDefinitions {
              name
              key
              type {
                name
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    console.log("Admin GraphQL response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
