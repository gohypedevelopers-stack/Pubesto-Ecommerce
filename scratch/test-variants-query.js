const { GraphQLClient } = require('graphql-request');

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
    products(first: 10) {
      edges {
        node {
          title
          handle
          variants(first: 50) {
            edges {
              node {
                id
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
                image {
                  url
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
    console.log("SUCCESS! Matches live fields:");
    data.products.edges.forEach(({ node }) => {
      console.log('Variants for ' + node.title + ' (' + node.handle + '):');
      node.variants.edges.forEach(({ node: v }) => {
        console.log(`  - Variant: ${v.title}, ID: ${v.id}`);
      });
    });
  })
  .catch(err => {
    console.error("Failed:", err.message);
  });
