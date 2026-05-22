const { Jimp } = require('jimp');
const path = require('path');

const brainDir = 'C:/Users/RK COMPUTERS/.gemini/antigravity/brain/e62b8597-2ee3-49fa-8945-8d55c75a501f';
const img1 = path.join(brainDir, 'media__1779431672641.png');
const img2 = path.join(brainDir, 'media__1779431675408.png');

async function check() {
  try {
    const image1 = await Jimp.read(img1);
    console.log('img1:', image1.width, 'x', image1.height);
  } catch (err) {
    console.error('Error reading img1:', err);
  }
  try {
    const image2 = await Jimp.read(img2);
    console.log('img2:', image2.width, 'x', image2.height);
  } catch (err) {
    console.error('Error reading img2:', err);
  }
}

check();
