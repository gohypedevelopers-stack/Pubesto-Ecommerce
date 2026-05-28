async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/products');
    if (!res.ok) {
      console.log('HTTP error:', res.status);
      return;
    }
    const products = await res.json();
    const fan = products.find(p => p.slug === 'adjustable-bladeless-neck-fan');
    console.log(JSON.stringify(fan.variants, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
