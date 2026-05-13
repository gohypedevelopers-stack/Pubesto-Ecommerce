import { GraphQLClient } from "graphql-request";

// Fallback to literal values so you don't have to restart the Next.js server to pick up .env changes
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN !== 'your-store.myshopify.com'
  ? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  : 'my-store-300000000000000009154.myshopify.com';

const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN && process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN !== 'your_token'
  ? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  : 'e2145b4e1e57dee9f08991b46cfc51b8';

const endpoint = `https://${domain}/api/2023-10/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
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
          availableForSale
          tags
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
                availableForSale
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
      image: node.images.edges[0]?.node.url || "/images/placeholder.jpg",
      gallery: node.images.edges.map(e => e.node.url),
      price: `₹${parseFloat(node.variants.edges[0]?.node.price.amount || 0).toLocaleString('en-IN')}`,
      oldPrice: node.variants.edges[0]?.node.compareAtPrice 
        ? `₹${parseFloat(node.variants.edges[0].node.compareAtPrice.amount).toLocaleString('en-IN')}` 
        : null,
      categories: node.collections.edges.map(e => e.node.title),
      inStock: node.availableForSale,
      highlights: node.tags || ["Premium Quality", "Artisanal Design", "Durability Guaranteed"],
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
