const { GraphQLClient } = require('graphql-request');

const endpoint = 'https://my-store-300000000000000009154.myshopify.com/api/2023-10/graphql.json';
const client = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': 'e2145b4e1e57dee9f08991b46cfc51b8',
  },
});

const PRODUCTS_QUERY = `
  query {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          images(first: 10) {
            edges {
              node {
                url
                altText
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
    const data = await client.request(PRODUCTS_QUERY);
    for (const { node } of data.products.edges) {
      console.log(`Product: ${node.title} (${node.handle})`);
      console.log('Images:');
      for (const edge of node.images.edges) {
        console.log(`  - ${edge.node.url}`);
      }
      console.log('---');
    }
  } catch (error) {
    console.error(error);
  }
}

run();
