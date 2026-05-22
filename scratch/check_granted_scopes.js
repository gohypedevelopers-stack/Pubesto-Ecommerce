const domain = 'my-store-300000000000000009154.myshopify.com';
const adminToken = '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';

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
