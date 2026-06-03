function testEmailOverride(email) {
  let finalEmail = email;
  if (!finalEmail || finalEmail === "amitsharma500677@gmail.com") {
    finalEmail = "pubesto.in@gmail.com";
  }
  return finalEmail;
}

console.log("Empty email:", testEmailOverride(""));
console.log("Null email:", testEmailOverride(null));
console.log("Amit email:", testEmailOverride("amitsharma500677@gmail.com"));
console.log("Customer email:", testEmailOverride("customer@gmail.com"));
