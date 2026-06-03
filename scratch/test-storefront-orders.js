const domain = "jjiygt-gt.myshopify.com";
const token = "e2145b4e1e57dee9f08991b46cfc51b8";

const query = `
  query getCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 50) {
        edges {
          node {
            id
            name
            processedAt
            cancelReason
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            lineItems(first: 50) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                    }
                    product {
                      handle
                      featuredImage {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function test() {
  const url = `https://${domain}/api/2023-10/graphql.json`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query,
        variables: { customerAccessToken: "dummy_token" },
      }),
    });

    console.log("Status:", response.status, response.statusText);
    const resJson = await response.json();
    console.log("Response errors:", resJson.errors);
    console.log("Response data:", resJson.data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

test();
