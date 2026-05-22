const { GraphQLClient } = require("graphql-request");

const domain = 'my-store-300000000000000009154.myshopify.com';
const token = 'e2145b4e1e57dee9f08991b46cfc51b8';
const endpoint = `https://${domain}/api/2023-10/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
  },
});

const typesToTest = ["reviews", "review", "product_reviews", "product_review", "testimonial", "testimonials", "customer_reviews", "customer_review"];

async function run() {
  for (const type of typesToTest) {
    const query = `
      query getMetaobjects($type: String!) {
        metaobjects(first: 10, type: $type) {
          edges {
            node {
              id
              type
              handle
              fields {
                key
                value
              }
            }
          }
        }
      }
    `;

    try {
      const data = await client.request(query, { type });
      if (data.metaobjects?.edges?.length > 0) {
        console.log(`\nFound metaobjects for type: ${type}`);
        console.log(JSON.stringify(data.metaobjects.edges, null, 2));
      } else {
        console.log(`Type ${type}: 0 results`);
      }
    } catch (err) {
      console.log(`Type ${type} failed:`, err.message || err);
    }
  }
}

run();
