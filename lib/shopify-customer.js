import { isLocalCustomerAuthMode } from "./auth-mode";

const SHOPIFY_API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2023-10";
const FALLBACK_SHOPIFY_STORE_DOMAIN = "my-store-300000000000000009154.myshopify.com";
const FALLBACK_STOREFRONT_TOKEN = "e2145b4e1e57dee9f08991b46cfc51b8";

const CUSTOMER_FIELDS = `
  id
  displayName
  firstName
  lastName
  email
  phone
  addresses(first: 50) {
    edges {
      node {
        id
        name
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
    }
  }
`;

export class ShopifyCustomerAuthError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ShopifyCustomerAuthError";
    this.code = options.code || "SHOPIFY_CUSTOMER_AUTH_ERROR";
    this.userErrors = options.userErrors || [];
    this.retryable = Boolean(options.retryable);
  }
}

function normalizeStoreDomain(value) {
  return String(value || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .trim();
}

function getStorefrontConfig() {
  if (isLocalCustomerAuthMode()) {
    throw new ShopifyCustomerAuthError("Local customer auth mode is enabled.", {
      code: "SHOPIFY_CUSTOMER_AUTH_LOCAL_MODE",
      retryable: true,
    });
  }

  const domain = normalizeStoreDomain(
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || FALLBACK_SHOPIFY_STORE_DOMAIN
  );
  const token = (
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    FALLBACK_STOREFRONT_TOKEN
  )?.trim();

  if (!domain || !token) {
    throw new ShopifyCustomerAuthError("Shopify customer auth is not configured.", {
      code: "SHOPIFY_CUSTOMER_AUTH_CONFIG",
      retryable: true,
    });
  }

  return { domain, token };
}

function getUserErrors(payload) {
  if (!payload || typeof payload !== "object") return [];
  const key = Object.keys(payload).find((name) => Array.isArray(payload[name]?.customerUserErrors));
  return key ? payload[key].customerUserErrors : [];
}

function firstUserErrorMessage(userErrors, fallback) {
  return userErrors.find((error) => error?.message)?.message || fallback;
}

function throwForUserErrors(payload, fallback) {
  const userErrors = getUserErrors(payload);
  if (userErrors.length > 0) {
    throw new ShopifyCustomerAuthError(firstUserErrorMessage(userErrors, fallback), {
      code: userErrors[0]?.code || "SHOPIFY_CUSTOMER_USER_ERROR",
      userErrors,
      retryable: false,
    });
  }
}

async function shopifyRequest(query, variables = {}) {
  const { domain, token } = getStorefrontConfig();

  let response;
  try {
    response = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
  } catch (error) {
    throw new ShopifyCustomerAuthError("Could not reach Shopify customer accounts.", {
      code: "SHOPIFY_CUSTOMER_NETWORK",
      retryable: true,
      cause: error,
    });
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new ShopifyCustomerAuthError("Shopify returned an unreadable response.", {
      code: "SHOPIFY_CUSTOMER_BAD_RESPONSE",
      retryable: true,
      cause: error,
    });
  }

  if (!response.ok || payload.errors?.length) {
    const message = payload.errors?.[0]?.message || "Shopify customer request failed.";
    throw new ShopifyCustomerAuthError(message, {
      code: "SHOPIFY_CUSTOMER_GRAPHQL",
      retryable: true,
      userErrors: payload.errors || [],
    });
  }

  return payload.data;
}

function splitName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Pubesto", lastName: "Customer" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhoneForShopify(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return undefined;
  if (raw.startsWith("+")) return raw;

  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return raw;
}

function compactInput(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  );
}

function mapShopifyAddress(address) {
  const name = address.name || [address.firstName, address.lastName].filter(Boolean).join(" ");

  return {
    id: address.id,
    label: address.company || "Home",
    name,
    phone: address.phone || "",
    line1: address.address1 || "",
    line2: address.address2 || "",
    city: address.city || "",
    state: address.province || "",
    pincode: address.zip || "",
  };
}

function mapShopifyCustomer(customer) {
  if (!customer) return null;
  const fullName = customer.displayName || [customer.firstName, customer.lastName].filter(Boolean).join(" ");

  return {
    id: customer.id,
    name: fullName || "Pubesto Customer",
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    email: customer.email,
    phone: customer.phone || "",
    provider: "shopify",
    addresses: (customer.addresses?.edges || []).map(({ node }) => mapShopifyAddress(node)),
  };
}

function toMailingAddressInput(address) {
  const { firstName, lastName } = splitName(address.name);

  return compactInput({
    firstName,
    lastName,
    company: String(address.label || "Home").trim() || undefined,
    address1: String(address.line1 || "").trim(),
    address2: String(address.line2 || "").trim() || undefined,
    city: String(address.city || "").trim(),
    province: String(address.state || "").trim(),
    country: "India",
    zip: String(address.pincode || "").trim(),
    phone: normalizePhoneForShopify(address.phone),
  });
}

export function isRecoverableShopifyCustomerError(error) {
  return error instanceof ShopifyCustomerAuthError && error.retryable;
}

export async function getShopifyCustomer(customerAccessToken) {
  if (!customerAccessToken) return null;

  const data = await shopifyRequest(
    `
      query customerAccount($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          ${CUSTOMER_FIELDS}
        }
      }
    `,
    { customerAccessToken }
  );

  return mapShopifyCustomer(data.customer);
}

export async function loginShopifyCustomer({ email, password }) {
  const data = await shopifyRequest(
    `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    {
      input: {
        email: normalizeEmail(email),
        password: String(password || ""),
      },
    }
  );

  throwForUserErrors(data, "Invalid email or password.");

  const token = data.customerAccessTokenCreate.customerAccessToken;
  const user = await getShopifyCustomer(token?.accessToken);
  if (!token?.accessToken || !user) {
    throw new ShopifyCustomerAuthError("Invalid email or password.", {
      code: "SHOPIFY_CUSTOMER_INVALID_LOGIN",
      retryable: false,
    });
  }

  return {
    user,
    customerAccessToken: token.accessToken,
    expiresAt: token.expiresAt,
  };
}

export async function createShopifyCustomer({ name, email, phone, password }) {
  const { firstName, lastName } = splitName(name);
  const input = compactInput({
    firstName,
    lastName,
    email: normalizeEmail(email),
    password: String(password || ""),
    phone: normalizePhoneForShopify(phone),
    acceptsMarketing: false,
  });

  const data = await shopifyRequest(
    `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    { input }
  );

  throwForUserErrors(data, "Could not create your Shopify customer account.");
  return loginShopifyCustomer({ email, password });
}

export async function recoverShopifyCustomerPassword(email) {
  const data = await shopifyRequest(
    `
      mutation customerRecover($email: String!) {
        customerRecover(email: $email) {
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    { email: normalizeEmail(email) }
  );

  const userErrors = getUserErrors(data);
  const invalidFormatError = userErrors.find((error) => error?.field?.includes("email"));
  if (invalidFormatError) {
    throw new ShopifyCustomerAuthError(invalidFormatError.message || "Enter a valid email address.", {
      code: invalidFormatError.code || "SHOPIFY_CUSTOMER_EMAIL_INVALID",
      userErrors,
      retryable: false,
    });
  }

  return true;
}

async function updateShopifyCustomerDetails(customerAccessToken, updates) {
  const customer = {};

  if (updates.name !== undefined) {
    const { firstName, lastName } = splitName(updates.name);
    customer.firstName = firstName;
    customer.lastName = lastName;
  }

  if (updates.phone !== undefined) {
    customer.phone = normalizePhoneForShopify(updates.phone) || null;
  }

  if (Object.keys(customer).length === 0) {
    return { customerAccessToken };
  }

  const data = await shopifyRequest(
    `
      mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer {
            id
          }
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    { customerAccessToken, customer }
  );

  throwForUserErrors(data, "Could not update your Shopify account.");

  const nextToken = data.customerUpdate.customerAccessToken;
  return {
    customerAccessToken: nextToken?.accessToken || customerAccessToken,
    expiresAt: nextToken?.expiresAt,
  };
}

async function createShopifyAddress(customerAccessToken, address) {
  const data = await shopifyRequest(
    `
      mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
        customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
          customerAddress {
            id
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    {
      customerAccessToken,
      address: toMailingAddressInput(address),
    }
  );

  throwForUserErrors(data, "Could not add this address.");
}

async function updateShopifyAddress(customerAccessToken, id, address) {
  const data = await shopifyRequest(
    `
      mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
          customerAddress {
            id
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    {
      customerAccessToken,
      id,
      address: toMailingAddressInput(address),
    }
  );

  throwForUserErrors(data, "Could not update this address.");
}

async function deleteShopifyAddress(customerAccessToken, id) {
  const data = await shopifyRequest(
    `
      mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
        customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
          deletedCustomerAddressId
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    { customerAccessToken, id }
  );

  throwForUserErrors(data, "Could not remove this address.");
}

async function syncShopifyAddresses(customerAccessToken, nextAddresses) {
  if (!Array.isArray(nextAddresses)) return;

  const currentUser = await getShopifyCustomer(customerAccessToken);
  const currentAddresses = currentUser?.addresses || [];
  const currentIds = new Set(currentAddresses.map((address) => address.id));
  const nextIds = new Set(
    nextAddresses
      .map((address) => String(address.id || ""))
      .filter((id) => currentIds.has(id))
  );

  for (const currentAddress of currentAddresses) {
    if (!nextIds.has(currentAddress.id)) {
      await deleteShopifyAddress(customerAccessToken, currentAddress.id);
    }
  }

  for (const address of nextAddresses) {
    if (currentIds.has(address.id)) {
      await updateShopifyAddress(customerAccessToken, address.id, address);
    } else {
      await createShopifyAddress(customerAccessToken, address);
    }
  }
}

export async function updateShopifyCustomer(customerAccessToken, updates = {}) {
  const tokenUpdate = await updateShopifyCustomerDetails(customerAccessToken, updates);
  const nextAccessToken = tokenUpdate.customerAccessToken || customerAccessToken;

  await syncShopifyAddresses(nextAccessToken, updates.addresses);
  const user = await getShopifyCustomer(nextAccessToken);

  return {
    user,
    customerAccessToken: nextAccessToken,
    expiresAt: tokenUpdate.expiresAt,
  };
}
