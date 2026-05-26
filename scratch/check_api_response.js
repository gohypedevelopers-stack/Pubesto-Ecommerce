async function main() {
  const res = await fetch('http://localhost:3000/api/products');
  if (res.ok) {
    const products = await res.json();
    const fan = products.find(p => p.slug === 'mist-double-headed-led-fan');
    if (fan) {
      console.log('MIST FAN FROM API:');
      console.log('Image:', fan.image);
      console.log('Gallery:', fan.gallery);
    } else {
      console.log('Mist Fan not found in API response');
    }
  } else {
    console.log('API call failed:', res.status);
  }
}
main().catch(console.error);
