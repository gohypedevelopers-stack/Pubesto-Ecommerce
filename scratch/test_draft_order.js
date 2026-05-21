// Use native fetch instead of node-fetch-commonjs

const domain = 'my-store-300000000000000009154.myshopify.com';
const adminToken = 'YOUR_SHOPIFY_ADMIN_ACCESS_TOKEN';

const query = `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        invoiceUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const lineItems = [
  {
    quantity: 1,
    title: "Test Product",
    originalUnitPrice: "800.00"
  }
];

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
          input: {
            lineItems,
          }
        }
      })
    });

    const resJson = await response.json();
    console.log(JSON.stringify(resJson, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
