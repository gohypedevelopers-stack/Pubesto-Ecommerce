const { Jimp } = require('jimp');
const path = require('path');

const src = 'C:/Users/RK COMPUTERS/.gemini/antigravity/brain/e62b8597-2ee3-49fa-8945-8d55c75a501f/media__1779431675408.png';
const dest = 'd:/My Projects/Pubesto-Ecom/public/images/products/portable-ac.jpg';

async function convert() {
  try {
    const image = await Jimp.read(src);
    await image.write(dest);
    console.log('Successfully wrote converted image to:', dest);
  } catch (err) {
    console.error('Error during conversion:', err);
  }
}
convert();
