const { GraphQLClient } = require("graphql-request");

// We read from the active environment variables
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'my-store-300000000000000009154.myshopify.com';
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'e2145b4e1e57dee9f08991b46cfc51b8';

console.log("Querying Shopify Storefront Domain:", domain);
console.log("With Token:", token);

const client = new GraphQLClient(`https://${domain}/api/2023-10/graphql.json`, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
  },
});

const query = `
  {
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          variants(first: 50) {
            edges {
              node {
                id
                title
                sku
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

client.request(query)
  .then(data => {
    console.log("SUCCESS! Here are the products and their variants:");
    for (const { node } of data.products.edges) {
      console.log(`\nProduct: ${node.title} (${node.handle})`);
      for (const { node: variant } of node.variants.edges) {
        console.log(`  - Variant: ${variant.title} | ID: ${variant.id} | SKU: ${variant.sku}`);
      }
    }
  })
  .catch(err => {
    console.error("GraphQL Request failed:", err.message);
  });
