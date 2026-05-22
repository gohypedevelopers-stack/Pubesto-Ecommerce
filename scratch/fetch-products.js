const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = val;
  }
});

const domain = env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'my-store-300000000000000009154.myshopify.com';
const token = env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'e2145b4e1e57dee9f08991b46cfc51b8';


console.log('Domain:', domain);
console.log('Token:', token);

const endpoint = `https://${domain}/api/2023-10/graphql.json`;

const query = `
  {
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          images(first: 20) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

async function main() {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query }),
  });

  const json = await response.json();
  if (json.errors) {
    console.error('GraphQL errors:', json.errors);
  } else {
    fs.writeFileSync(path.join(__dirname, 'shopify-products.json'), JSON.stringify(json.data.products.edges, null, 2));
    console.log('Successfully wrote shopify-products.json');
  }
}

main().catch(console.error);
