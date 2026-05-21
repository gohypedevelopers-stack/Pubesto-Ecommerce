async function test() {
  const domain = 'my-store-300000000000000009154.myshopify.com';
  const adminToken = 'YOUR_SHOPIFY_ADMIN_ACCESS_TOKEN';

  try {
    const res = await fetch(`https://${domain}/admin/oauth/access_scopes.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': adminToken,
      }
    });
    const json = await res.json();
    console.log("Status:", res.status);
    console.log("Access Scopes:", JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
