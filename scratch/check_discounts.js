const domain = 'my-store-300000000000000009154.myshopify.com';
const adminToken = 'YOUR_SHOPIFY_ADMIN_ACCESS_TOKEN';

async function run() {
  try {
    const urls = [
      `https://${domain}/admin/api/2023-10/price_rules.json`,
      `https://${domain}/admin/api/2023-10/discount_codes.json`,
    ];
    for (const url of urls) {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        }
      });
      const data = await response.json();
      console.log(url, JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
