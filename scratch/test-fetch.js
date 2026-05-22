async function main() {
  const { products } = await import('../lib/data.js');
  const neckFan = products.find(p => p.slug === 'adjustable-bladeless-neck-fan');
  if (neckFan) {
    console.log('Neck Fan Colors:', neckFan.colors);
  } else {
    console.log('Neck Fan not found');
  }
}
main().catch(console.error);
