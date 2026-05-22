const { GraphQLClient } = require("graphql-request");

const domain = 'my-store-300000000000000009154.myshopify.com';
const token = 'e2145b4e1e57dee9f08991b46cfc51b8';
const endpoint = `https://${domain}/api/2023-10/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
  },
});

const metafieldKeys = [
  { namespace: "custom", key: "reviews" },
  { namespace: "custom", key: "reviews_list" },
  { namespace: "custom", key: "rating" },
  { namespace: "custom", key: "reviews_count" },
  { namespace: "custom", key: "reviews_data" },
  { namespace: "custom", key: "review_data" },
  { namespace: "custom", key: "testimonials" },
  { namespace: "custom", key: "testimonial_list" },
  { namespace: "custom", key: "reviews_json" },
  { namespace: "custom", key: "reviews_list_json" },
  { namespace: "custom", key: "reviews_details" },
  { namespace: "custom", key: "reviews_list_data" },
  { namespace: "reviews", key: "rating" },
  { namespace: "reviews", key: "rating_count" },
  { namespace: "reviews", key: "list" },
  { namespace: "reviews", key: "reviews" },
  { namespace: "reviews", key: "reviews_list" },
  { namespace: "reviews", key: "data" },
  { namespace: "shopify", key: "reviews" },
  { namespace: "shopify", key: "rating" },
  { namespace: "shopify", key: "rating_count" },
  { namespace: "shopify", key: "reviews_count" }
];

async function run() {
  const query = `
    query getProducts {
      products(first: 250) {
        edges {
          node {
            id
            title
            handle
            ${metafieldKeys.map((item, idx) => `
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
    console.log("Checking products...");
    let foundAny = false;
    for (const edge of data.products.edges) {
      const node = edge.node;
      const foundForThisProduct = [];
      metafieldKeys.forEach((item, idx) => {
        const metafield = node[`meta_${idx}`];
        if (metafield && metafield.value) {
          foundForThisProduct.push(`${metafield.namespace}.${metafield.key} (${metafield.type}): ${metafield.value}`);
          foundAny = true;
        }
      });
      if (foundForThisProduct.length > 0) {
        console.log(`\nProduct: ${node.title} (${node.handle})`);
        foundForThisProduct.forEach(line => console.log(line));
      }
    }
    if (!foundAny) {
      console.log("No review-related metafields found on any product.");
    }
  } catch (err) {
    console.error("Error fetching storefront reviews:", err);
  }
}

run();
