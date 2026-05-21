const domain = 'my-store-300000000000000009154.myshopify.com';
const adminToken = 'YOUR_SHOPIFY_ADMIN_ACCESS_TOKEN';

async function run() {
  try {
    const response = await fetch(`https://${domain}/admin/api/2023-10/shop.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      }
    });
    console.log("Status:", response.status);
    for (const [key, val] of response.headers.entries()) {
      console.log(`${key}: ${val}`);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
