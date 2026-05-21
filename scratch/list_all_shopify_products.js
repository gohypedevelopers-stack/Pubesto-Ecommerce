const { GraphQLClient } = require("graphql-request");

const domain = 'my-store-300000000000000009154.myshopify.com';
const token = 'e2145b4e1e57dee9f08991b46cfc51b8';
const endpoint = `https://${domain}/api/2023-10/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
  },
});

const query = `
  {
    products(first: 250) {
      edges {
        node {
          id
          title
          handle
          variants(first: 250) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
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
    const data = await client.request(query);
    console.log("Found products count:", data.products.edges.length);
    for (const p of data.products.edges) {
      console.log(`- Product: ${p.node.title} (${p.node.handle})`);
      for (const v of p.node.variants.edges) {
        console.log(`    * Variant: ${v.node.title} (ID: ${v.node.id}) - Price: ${v.node.price.amount}`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
