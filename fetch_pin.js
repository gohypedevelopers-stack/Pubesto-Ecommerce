async function getPin() {
  const res = await fetch('https://pin.it/6nmaMq8H6', { redirect: 'follow' });
  const text = await res.text();
  const match = text.match(/https:\/\/[^"]+\.jpg/g);
  if (match) {
    console.log("FOUND_IMG:", match.join('\n'));
  } else {
    console.log("NO_IMG_FOUND");
  }
}
getPin();
