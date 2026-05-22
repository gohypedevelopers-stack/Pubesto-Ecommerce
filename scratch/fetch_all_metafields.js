const shop = "my-store-300000000000000009154.myshopify.com";
const adminToken = "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";

async function run() {
  const url = `https://${shop}/admin/api/2023-10/products.json`;
  try {
    const res = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": adminToken,
      },
    });
    const productsData = await res.json();
    console.log("Response:", JSON.stringify(productsData, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
