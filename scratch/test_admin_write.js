const shop = "my-store-300000000000000009154.myshopify.com";
const adminToken = "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";

async function run() {
  const productId = "9247021924568"; // Adjustable Bladeless Neck Fan
  const url = `https://${shop}/admin/api/2023-10/products/${productId}/metafields.json`;
  
  const payload = {
    metafield: {
      namespace: "custom",
      key: "reviews_list",
      value: JSON.stringify([
        { text: "Best neck fan ever! Saved me in hot weather.", name: "Rahul S.", rating: 5 },
        { text: "No blades, so it is safe for long hair.", name: "Ananya B.", rating: 5 },
        { text: "Amazing battery life. I use it at work daily.", name: "Vikram P.", rating: 4 },
        { text: "Very comfortable to wear all day.", name: "Sneha G.", rating: 5 }
      ]),
      type: "json"
    }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify(payload)
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
