const { GraphQLClient } = require("graphql-request");

const domain = 'my-store-300000000000000009154.myshopify.com';
const token = 'e2145b4e1e57dee9f08991b46cfc51b8';
const endpoint = `https://${domain}/api/2023-10/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
  },
});

const keysToTest = [
  { namespace: "custom", key: "reviews" },
  { namespace: "custom", key: "reviews_list" },
  { namespace: "custom", key: "reviews_data" },
  { namespace: "custom", key: "review_list" },
  { namespace: "custom", key: "rating" },
  { namespace: "custom", key: "reviews_count" },
  { namespace: "reviews", key: "rating" },
  { namespace: "reviews", key: "rating_count" },
  { namespace: "reviews", key: "list" },
  { namespace: "shopify", key: "reviews" }
];

async function run() {
  const query = `
    query getProducts {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            ${keysToTest.map((item, idx) => `
              meta_${idx}: metafield(namespace: "${item.namespace}", key: "${item.key}") {
                namespace
                key
                value
                type
              }
            `).join("\n")}
          }
        }
      }
    }
  `;

  try {
    const data = await client.request(query);
    for (const edge of data.products.edges) {
      console.log(`\nProduct: ${edge.node.title} (${edge.node.handle})`);
      keysToTest.forEach((item, idx) => {
        const metafield = edge.node[`meta_${idx}`];
        if (metafield) {
          console.log(`  - ${metafield.namespace}.${metafield.key} (${metafield.type}): ${metafield.value}`);
        } else {
          // console.log(`  - ${item.namespace}.${item.key}: null`);
        }
      });
    }
  } catch (err) {
    console.error("Error fetching storefront reviews:", err);
  }
}

run();
