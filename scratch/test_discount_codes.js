const { GraphQLClient } = require("graphql-request");

const domain = 'my-store-300000000000000009154.myshopify.com';
const token = 'e2145b4e1e57dee9f08991b46cfc51b8';
const endpoint = `https://${domain}/api/2023-10/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
  },
});

const createCartMutation = `
  mutation createCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
      }
    }
  }
`;

const updateDiscountMutation = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        discountCodes {
          code
          applicable
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const candidateCodes = [
  "PACKOF2", "PACKOF4", "SAVE867", "SAVE1598", "BUNDLE", "EXTRA", "DISCOUNT", "WELCOME", "SUMMER", "PUBESTO"
];

async function run() {
  try {
    // White Neck Fan (800 Rs) with quantity 2
    const cartRes = await client.request(createCartMutation, {
      lines: [
        {
          quantity: 2,
          merchandiseId: "gid://shopify/ProductVariant/51699939508440"
        }
      ]
    });
    const cartId = cartRes.cartCreate.cart.id;
    console.log("Created cart with 2 items:", cartId);

    for (const code of candidateCodes) {
      const discRes = await client.request(updateDiscountMutation, {
        cartId,
        discountCodes: [code]
      });
      const applied = discRes.cartDiscountCodesUpdate.cart?.discountCodes || [];
      const cost = discRes.cartDiscountCodesUpdate.cart?.cost?.totalAmount?.amount;
      const userErrors = discRes.cartDiscountCodesUpdate.userErrors || [];
      console.log(`Code: ${code} -> Applied:`, JSON.stringify(applied), `Cost: ${cost}`, `Errors:`, JSON.stringify(userErrors));
    }
  } catch (err) {
    console.error(err);
  }
}

run();
