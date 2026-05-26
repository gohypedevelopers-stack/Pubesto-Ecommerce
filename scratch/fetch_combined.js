const { getShopifyProducts } = require('../lib/shopify.js');

async function main() {
  const products = await getShopifyProducts();
  const fan = products.find(p => p.slug === 'mist-double-headed-led-fan');
  if (fan) {
    console.log('MIST FAN DETAILS:');
    console.log('Name:', fan.name);
    console.log('Image:', fan.image);
    console.log('Gallery:', fan.gallery);
    console.log('Colors:', fan.colors);
  } else {
    console.log('Mist Fan not found');
  }
}
main().catch(console.error);
