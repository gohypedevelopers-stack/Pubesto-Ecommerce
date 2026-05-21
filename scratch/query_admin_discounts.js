const domain = 'my-store-300000000000000009154.myshopify.com';
const adminToken = 'YOUR_SHOPIFY_ADMIN_ACCESS_TOKEN';

const query = `
  {
    codeDiscountNodes(first: 50) {
      edges {
        node {
          id
          codeDiscount {
            __typename
            ... on DiscountCodeBasic {
              title
              status
              summary
            }
            ... on DiscountCodeBxgy {
              title
              status
              summary
            }
            ... on DiscountCodeFreeShipping {
              title
              status
              summary
            }
          }
        }
      }
    }
    automaticDiscountNodes(first: 50) {
      edges {
        node {
          id
          automaticDiscount {
            __typename
            ... on DiscountAutomaticBasic {
              title
              status
              summary
            }
            ... on DiscountAutomaticBxgy {
              title
              status
              summary
            }
            ... on DiscountAutomaticFreeShipping {
              title
              status
              summary
            }
          }
        }
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
      body: JSON.stringify({ query })
    });
    const resJson = await response.json();
    console.log(JSON.stringify(resJson, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
