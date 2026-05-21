const domain = 'my-store-300000000000000009154.myshopify.com';
const adminToken = 'YOUR_SHOPIFY_ADMIN_ACCESS_TOKEN';

async function run() {
  try {
    const response = await fetch(`https://${domain}/admin/oauth/access_scopes.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      }
    });
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Granted Scopes:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
