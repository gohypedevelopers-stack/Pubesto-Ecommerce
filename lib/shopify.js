import { GraphQLClient } from "graphql-request";

const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token":
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
});

export const PRODUCTS_QUERY = `
  {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          collections(first: 5) {
            edges {
              node {
                title
              }
            }
          }
        }
      }
    }
  }
`;

export async function getShopifyProducts() {
  try {
    const data = await shopifyClient.request(PRODUCTS_QUERY);
    return data.products.edges.map(({ node }) => ({
      id: node.id,
      name: node.title,
      slug: node.handle,
      description: node.description,
      image: node.images.edges[0]?.node.url || "",
      gallery: node.images.edges.map(e => e.node.url),
      price: `₹${parseFloat(node.variants.edges[0]?.node.price.amount).toLocaleString('en-IN')}`,
      oldPrice: node.variants.edges[0]?.node.compareAtPrice 
        ? `₹${parseFloat(node.variants.edges[0].node.compareAtPrice.amount).toLocaleString('en-IN')}` 
        : null,
      categories: node.collections.edges.map(e => e.node.title),
      inStock: true,
      sku: node.variants.edges[0]?.node.id
    }));
  } catch (error) {
    console.error("Error fetching Shopify products:", error);
    return [];
  }
}

export async function createShopifyCart() {
  const mutation = `
    mutation {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;
  const data = await shopifyClient.request(mutation);
  return data.cartCreate.cart;
}

export async function addToShopifyCart(cartId, variantId) {
  const mutation = `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;
  const variables = {
    cartId,
    lines: [{ quantity: 1, merchandiseId: variantId }]
  };
  const data = await shopifyClient.request(mutation, variables);
  return data.cartLinesAdd.cart;
}
