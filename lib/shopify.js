import { GraphQLClient } from "graphql-request";

// Fallback to literal values so you don't have to restart the Next.js server to pick up .env changes
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN !== 'your-store.myshopify.com'
  ? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  : 'my-store-300000000000000009154.myshopify.com';

const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN && process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN !== 'your_token'
  ? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  : 'e2145b4e1e57dee9f08991b46cfc51b8';

function normalizeStoreDomain(value) {
  return String(value || domain)
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

const shopifyDomain = normalizeStoreDomain(domain);

// Custom Domain for Checkout Redirection
const customDomain = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN 
  ? normalizeStoreDomain(process.env.NEXT_PUBLIC_CUSTOM_DOMAIN)
  : 'pubesto.com'; // Defaulting to the brand domain found in the project

/**
 * Replaces the technical .myshopify.com domain with the custom brand domain
 * in checkout URLs to maintain brand consistency.
 */
export function fixShopifyCheckoutUrl(url) {
  if (!url) return url;
  // If the URL already uses the custom domain, do nothing
  if (url.includes(customDomain)) return url;
  // Replace the shopify domain with the custom domain
  return url.replace(shopifyDomain, customDomain);
}
const endpoint = `https://${shopifyDomain}/api/2023-10/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
  },
});

export function getShopifyStorefrontUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `https://${shopifyDomain}${normalizedPath}`;
}

export function getShopifyAccountUrl() {
  return getShopifyStorefrontUrl("/account");
}

export function getShopifyAccountLoginUrl() {
  return getShopifyStorefrontUrl("/account/login");
}

export function getShopifyAccountAddressesUrl() {
  return getShopifyStorefrontUrl("/account/addresses");
}

export function getShopifyCartUrl() {
  return getShopifyStorefrontUrl("/cart");
}

export function getShopifyVariantNumericId(variantId) {
  const value = String(variantId || "");
  if (/^\d+$/.test(value)) return value;
  return value.match(/ProductVariant\/(\d+)/)?.[1] || null;
}

export function getShopifyCartPermalink(items = []) {
  const lines = items
    .map((item) => {
      const variantId = getShopifyVariantNumericId(
        item.product?.shopifyVariantId || item.product?.variantId || item.product?.sku || item.variantId
      );
      const quantity = Math.max(1, Number(item.quantity) || 1);
      return variantId ? `${variantId}:${quantity}` : null;
    })
    .filter(Boolean);

  return lines.length > 0
    ? getShopifyStorefrontUrl(`/cart/${lines.join(",")}`)
    : getShopifyCartUrl();
}

function normalizeHighlight(value) {
  return String(value || "")
    .replace(/^[\s\-*•]+/, "")
    .trim();
}

export function parseShopifyHighlights(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeHighlight).filter(Boolean);
  }

  if (!value) return [];

  const rawValue = String(value).trim();
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeHighlight).filter(Boolean);
    }
    if (parsed && typeof parsed === "object") {
      return Object.values(parsed).flat().map(normalizeHighlight).filter(Boolean);
    }
  } catch {
    // Shopify list metafields are JSON; plain text metafields are not.
  }

  return rawValue
    .split(/\r?\n|[|;]/)
    .map(normalizeHighlight)
    .filter(Boolean);
}

function getFirstMetafieldHighlights(...metafields) {
  for (const metafield of metafields) {
    const highlights = parseShopifyHighlights(metafield?.value);
    if (highlights.length > 0) {
      return highlights;
    }
  }

  return [];
}

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
          keyHighlights: metafield(namespace: "custom", key: "key_highlights") {
            type
            value
          }
          keyHighlight: metafield(namespace: "custom", key: "key_highlight") {
            type
            value
          }
          highlights: metafield(namespace: "custom", key: "highlights") {
            type
            value
          }
          productHighlights: metafield(namespace: "custom", key: "product_highlights") {
            type
            value
          }
          keyFeatures: metafield(namespace: "custom", key: "key_features") {
            type
            value
          }
          features: metafield(namespace: "custom", key: "features") {
            type
            value
          }
          detailHighlights: metafield(namespace: "details", key: "key_highlights") {
            type
            value
          }
          globalHighlights: metafield(namespace: "global", key: "highlights") {
            type
            value
          }
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
        highlights: (() => {
          const metafieldHighlights = getFirstMetafieldHighlights(
            node.keyHighlights,
            node.keyHighlight,
          node.highlights,
          node.productHighlights,
          node.keyFeatures,
          node.features,
          node.detailHighlights,
          node.globalHighlights
        );
        const tagHighlights = Array.isArray(node.tags) ? node.tags.map(normalizeHighlight).filter(Boolean) : [];

          return metafieldHighlights.length > 0
            ? metafieldHighlights
            : tagHighlights.length > 0
              ? tagHighlights
              : [];
        })(),
      shopifyVariantId: node.variants.edges[0]?.node.id,
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
  const cart = data.cartCreate.cart;
  if (cart?.checkoutUrl) {
    cart.checkoutUrl = fixShopifyCheckoutUrl(cart.checkoutUrl);
  }
  return cart;
}

export async function addToShopifyCart(cartId, variantId, quantity = 1) {
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
    lines: [{ quantity, merchandiseId: variantId }]
  };
  const data = await shopifyClient.request(mutation, variables);
  const cart = data.cartLinesAdd.cart;
  if (cart?.checkoutUrl) {
    cart.checkoutUrl = fixShopifyCheckoutUrl(cart.checkoutUrl);
  }
  return cart;
}

export async function getShopifyVariantIdByHandle(handle) {
  const query = `
    query getProductVariant($handle: String!) {
      productByHandle(handle: $handle) {
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;
  const productData = await shopifyClient.request(query, { handle });
  return productData?.productByHandle?.variants?.edges?.[0]?.node?.id || null;
}

/**
 * Given a Shopify product handle and quantity, creates a fresh Shopify cart
 * with that item and returns the checkout URL for direct redirect.
 */
export async function getShopifyCheckoutUrl(handle, quantity = 1) {
  // 1. Fetch the product variant ID by handle
  const variantId = await getShopifyVariantIdByHandle(handle);

  if (!variantId) {
    throw new Error(`No Shopify variant found for handle: ${handle}`);
  }

  // 2. Create a new cart with the item
  const mutation = `
    mutation createCartWithItem($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const cartData = await shopifyClient.request(mutation, {
    lines: [{ quantity, merchandiseId: variantId }]
  });

  const checkoutUrl = cartData?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error("Failed to create Shopify checkout URL.");
  }
  return fixShopifyCheckoutUrl(checkoutUrl);
}
