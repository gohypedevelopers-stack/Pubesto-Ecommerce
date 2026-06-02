# Pubesto Ecom

Next.js App Router ecommerce home page for Pubesto.

## Scripts

```bash
npm run dev
npm run build
npm run start
```

## Account Auth

Local development can use the JSON-backed customer store by setting:

```env
PUBESTO_CUSTOMER_AUTH_MODE=local
```

For `https://www.pubesto.com`, use Shopify-backed customer accounts so login, signup, and forgot password persist across deployments:

```env
PUBESTO_CUSTOMER_AUTH_MODE=shopify
AUTH_SESSION_SECRET=<strong-random-secret>
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=<your-store>.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=<storefront-token>
NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN=www.pubesto.com
```

`NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` is the real Shopify shop used for Admin and Storefront API calls.
`NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN` is only for customer-facing Shopify cart, checkout, and draft-order invoice URLs.

Before setting `NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN` in production, connect that hostname in Shopify Admin and make it a Shopify-served custom domain. If `www.pubesto.com` remains pointed at the Next.js deployment, Shopify checkout paths on that same hostname will not be served by Shopify; use a Shopify-owned checkout subdomain instead.

## Project Structure

```text
app/
  globals.css
  layout.jsx
  page.jsx
public/
next.config.mjs
jsconfig.json
package.json
```
