export function getCustomerAuthMode() {
  const mode = String(process.env.PUBESTO_CUSTOMER_AUTH_MODE || "auto").trim().toLowerCase();
  return ["auto", "local", "shopify"].includes(mode) ? mode : "auto";
}

export function isLocalCustomerAuthMode() {
  return getCustomerAuthMode() === "local";
}

export function isShopifyCustomerAuthMode() {
  return getCustomerAuthMode() !== "local";
}

export function canUseLocalCustomerAuthFallback() {
  const mode = getCustomerAuthMode();
  return mode === "local" || (mode === "auto" && process.env.NODE_ENV !== "production");
}
