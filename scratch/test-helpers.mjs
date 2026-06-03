import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  }
}

import { recoverShopifyCustomerPassword } from "../lib/shopify-customer.js";

async function run() {
  console.log("Starting helper test...");
  console.log("PUBESTO_CUSTOMER_AUTH_MODE:", process.env.PUBESTO_CUSTOMER_AUTH_MODE);
  console.log("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:", process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
  console.log("SHOPIFY_STOREFRONT_ACCESS_TOKEN:", process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);

  try {
    const result = await recoverShopifyCustomerPassword("pubesto.in@gmail.com");
    console.log("Result:", result);
  } catch (error) {
    console.error("Caught error:", error);
    console.error("Error properties:", {
      message: error.message,
      code: error.code,
      retryable: error.retryable,
      userErrors: error.userErrors,
    });
  }
}

run();
