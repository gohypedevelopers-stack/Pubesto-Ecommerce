const { GraphQLClient } = require("graphql-request");

const domain = 'my-store-300000000000000009154.myshopify.com';
const token = 'e2145b4e1e57dee9f08991b46cfc51b8';
const endpoint = `https://${domain}/api/2023-10/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
  },
});

async function run() {
  const query = `
    {
      metaobjects(first: 50) {
        edges {
          node {
            id
            type
            handle
          }
        }
      }
    }
  `;

  try {
    const data = await client.request(query);
    console.log("Success:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("Failed:", err.message || err);
  }
}

run();
