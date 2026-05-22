export function getCustomerAuthMode() {
  return String(process.env.PUBESTO_CUSTOMER_AUTH_MODE || "auto").trim().toLowerCase();
}

export function isLocalCustomerAuthMode() {
  return getCustomerAuthMode() === "local";
}

export function canUseLocalCustomerAuthFallback() {
  return isLocalCustomerAuthMode() || process.env.NODE_ENV !== "production";
}
