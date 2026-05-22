const fs = require('fs');
const path = require('path');

const urls = [
  "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/neck-fan_1.jpg?v=1778758766",
  "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/Nry_d9k_Ih5eVO-aMev_1.jpg?v=1779260357",
  "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/Nry_dAITgVg7uVw3l-C_1.png?v=1779260383",
  "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/Nry_dAiNChVX-RpGknZ_1.png?v=1779260410",
  "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/Nry_dB7ZRunzkgM3D8R_1.png?v=1779260438"
];

async function download(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(destPath, buffer);
  console.log(`Downloaded ${url} to ${destPath}`);
}

async function main() {
  const outDir = path.join(__dirname, 'neck-fans');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const ext = url.includes('.png') ? '.png' : '.jpg';
    await download(url, path.join(outDir, `fan_${i + 1}${ext}`));
  }
}

main().catch(console.error);
