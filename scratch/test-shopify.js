const domain = "jjiygt-gt.myshopify.com";
const token = "e2145b4e1e57dee9f08991b46cfc51b8";
const email = "dheerajsorout16500@gmail.com";

const query = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

async function test() {
  const url = `https://${domain}/api/2023-10/graphql.json`;
  console.log("Requesting URL:", url);
  console.log("Headers:", {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": token,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query,
        variables: { email },
      }),
    });

    console.log("Status:", response.status, response.statusText);
    const text = await response.text();
    console.log("Raw Response:", text);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

test();
