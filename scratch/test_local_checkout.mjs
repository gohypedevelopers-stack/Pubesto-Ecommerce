async function run() {
  try {
    const response = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: [
          {
            variantId: "gid://shopify/ProductVariant/51732555497688",
            quantity: 1,
            name: "Neck Fan - Arctic Silver",
            price: 599
          }
        ]
      })
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

run();
