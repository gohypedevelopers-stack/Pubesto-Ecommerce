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
```

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
