import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const CUSTOMERS_FILE = path.join(process.cwd(), "data", "customers.json");
const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = "sha512";

let cachedCustomers = null;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix = "cus") {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(5).toString("hex")}`;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(String(password), salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString("hex");

  return { salt, hash };
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function sanitizeCustomer(customer) {
  if (!customer) return null;
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone || "",
    addresses: Array.isArray(customer.addresses) ? customer.addresses : [],
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
  };
}

function normalizeAddress(address) {
  return {
    id: String(address.id || makeId("addr")),
    label: String(address.label || "Home").trim(),
    name: String(address.name || "").trim(),
    phone: String(address.phone || "").trim(),
    line1: String(address.line1 || "").trim(),
    line2: String(address.line2 || "").trim(),
    city: String(address.city || "").trim(),
    state: String(address.state || "").trim(),
    pincode: String(address.pincode || "").trim(),
  };
}

function normalizeCustomer(customer) {
  const createdAt = customer.createdAt || nowIso();
  return {
    id: String(customer.id || makeId()),
    name: String(customer.name || "Pubesto Customer").trim(),
    email: normalizeEmail(customer.email),
    phone: String(customer.phone || "").trim(),
    passwordHash: String(customer.passwordHash || ""),
    passwordSalt: String(customer.passwordSalt || ""),
    addresses: Array.isArray(customer.addresses) ? customer.addresses.map(normalizeAddress) : [],
    resetTokenHash: customer.resetTokenHash || "",
    resetTokenExpiresAt: customer.resetTokenExpiresAt || "",
    createdAt,
    updatedAt: customer.updatedAt || createdAt,
  };
}

async function readCustomersRaw() {
  if (cachedCustomers) return cachedCustomers;

  try {
    const raw = await fs.readFile(CUSTOMERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    cachedCustomers = Array.isArray(parsed) ? parsed.map(normalizeCustomer) : [];
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Failed to read customers file:", error);
    }
    cachedCustomers = [];
  }

  return cachedCustomers;
}

async function writeCustomers(customers) {
  const normalized = customers.map(normalizeCustomer);
  await fs.mkdir(path.dirname(CUSTOMERS_FILE), { recursive: true });
  await fs.writeFile(CUSTOMERS_FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  cachedCustomers = normalized;
  return normalized;
}

export async function getCustomerById(id) {
  const customers = await readCustomersRaw();
  return sanitizeCustomer(customers.find((customer) => customer.id === id));
}

export async function getCustomerByEmail(email) {
  const customers = await readCustomersRaw();
  return sanitizeCustomer(customers.find((customer) => customer.email === normalizeEmail(email)));
}

export async function createCustomer({ name, email, phone, password }) {
  const normalizedEmail = normalizeEmail(email);
  const customers = await readCustomersRaw();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Enter a valid email address.");
  }
  if (String(password || "").length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  if (customers.some((customer) => customer.email === normalizedEmail)) {
    throw new Error("An account already exists with this email.");
  }

  const { salt, hash } = hashPassword(password);
  const customer = normalizeCustomer({
    id: makeId(),
    name: String(name || "Pubesto Customer").trim(),
    email: normalizedEmail,
    phone,
    passwordHash: hash,
    passwordSalt: salt,
    addresses: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  await writeCustomers([...customers, customer]);
  return sanitizeCustomer(customer);
}

export async function verifyCustomerLogin({ email, password }) {
  const customers = await readCustomersRaw();
  const customer = customers.find((item) => item.email === normalizeEmail(email));
  if (!customer) return null;

  const { hash } = hashPassword(password, customer.passwordSalt);
  const candidateHash = Buffer.from(hash, "hex");
  const storedHash = Buffer.from(customer.passwordHash, "hex");
  const isValid = (
    candidateHash.length === storedHash.length &&
    crypto.timingSafeEqual(candidateHash, storedHash)
  );

  return isValid ? sanitizeCustomer(customer) : null;
}

export async function updateCustomerProfile(id, updates = {}) {
  const customers = await readCustomersRaw();
  const index = customers.findIndex((customer) => customer.id === id);
  if (index === -1) return null;

  const existing = customers[index];
  const nextCustomer = normalizeCustomer({
    ...existing,
    name: updates.name !== undefined ? updates.name : existing.name,
    phone: updates.phone !== undefined ? updates.phone : existing.phone,
    addresses: updates.addresses !== undefined ? updates.addresses : existing.addresses,
    updatedAt: nowIso(),
  });

  const nextCustomers = [...customers];
  nextCustomers[index] = nextCustomer;
  await writeCustomers(nextCustomers);
  return sanitizeCustomer(nextCustomer);
}

export async function createPasswordReset(email) {
  const customers = await readCustomersRaw();
  const index = customers.findIndex((customer) => customer.email === normalizeEmail(email));
  if (index === -1) return null;

  const token = crypto.randomBytes(32).toString("hex");
  const nextCustomers = [...customers];
  nextCustomers[index] = normalizeCustomer({
    ...customers[index],
    resetTokenHash: hashToken(token),
    resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    updatedAt: nowIso(),
  });

  await writeCustomers(nextCustomers);
  return { token, customer: sanitizeCustomer(nextCustomers[index]) };
}

export async function resetCustomerPassword({ token, password }) {
  if (String(password || "").length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const customers = await readCustomersRaw();
  const tokenHash = hashToken(token);
  const index = customers.findIndex((customer) => (
    customer.resetTokenHash === tokenHash &&
    customer.resetTokenExpiresAt &&
    new Date(customer.resetTokenExpiresAt).getTime() > Date.now()
  ));

  if (index === -1) return null;

  const { salt, hash } = hashPassword(password);
  const nextCustomers = [...customers];
  nextCustomers[index] = normalizeCustomer({
    ...customers[index],
    passwordHash: hash,
    passwordSalt: salt,
    resetTokenHash: "",
    resetTokenExpiresAt: "",
    updatedAt: nowIso(),
  });

  await writeCustomers(nextCustomers);
  return sanitizeCustomer(nextCustomers[index]);
}
