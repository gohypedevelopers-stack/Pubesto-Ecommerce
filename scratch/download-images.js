const fs = require('fs');
const path = require('path');

const imagesToDownload = [
  // Hamburger Kids Lunch Box
  {
    url: "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/lunch-box_1.jpg?v=1778759509",
    dest: "lunch-box-shopify-1.jpg"
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/OrhhG6ykUGKp4p_jnCP_1.jpg?v=1779260791",
    dest: "lunch-box-shopify-new-1.jpg"
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/O_QwXxnRWEHoXriUJ7x_1.jpg?v=1779260815",
    dest: "lunch-box-shopify-new-2.jpg"
  },
  
  // Mist Double Headed LED Fan
  {
    url: "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/mist-fan_1.jpg?v=1778759420",
    dest: "mist-fan-shopify-1.jpg"
  },
  // Mini Mist Cooling Fan (just in case)
  {
    url: "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/On6Y9cACIXZAnQLMH20_1.jpg?v=1779259888",
    dest: "mini-mist-fan-shopify-1.jpg"
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/OSP1bL9M4I7N-j8VUX0_1.jpg?v=1779259994",
    dest: "mini-mist-fan-shopify-2.jpg"
  },

  // Mini Portable Wall Mounted AC
  {
    url: "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/Os64dk_tb0Q6tsWwgYN_1.jpg?v=1779261060",
    dest: "portable-ac-shopify-new-1.jpg"
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/Os64dkb4t37DIiCVhk7_1.jpg?v=1779261101",
    dest: "portable-ac-shopify-new-2.jpg"
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0817/9197/5640/files/portable-ac_1.jpg?v=1778759307",
    dest: "portable-ac-shopify-1.jpg"
  }
];

async function download(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(destPath, buffer);
  console.log(`Downloaded ${url} to ${destPath} (${buffer.length} bytes)`);
}

async function main() {
  const scratchDir = path.join(__dirname, 'downloaded');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir);
  }

  for (const img of imagesToDownload) {
    try {
      await download(img.url, path.join(scratchDir, img.dest));
    } catch (e) {
      console.error(e);
    }
  }
}

main().catch(console.error);
