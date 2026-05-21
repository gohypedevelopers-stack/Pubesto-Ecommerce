const domain = 'my-store-300000000000000009154.myshopify.com';
const adminToken = 'YOUR_SHOPIFY_ADMIN_ACCESS_TOKEN';

const query = `
  mutation productVariantCreate($input: ProductVariantInput!) {
    productVariantCreate(input: $input) {
      productVariant {
        id
        title
        price
      }
      userErrors {
        field
        message
      }
    }
  }
`;

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
            productId: "gid://shopify/Product/9250008662232", // White Neck Fan
            title: "Test Bundle Variant",
            price: "1133.00",
            options: ["Test Option"]
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
