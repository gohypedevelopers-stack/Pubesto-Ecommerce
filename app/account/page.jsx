"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, LogOut, MapPin, PackageX, Plus, Save, Trash2, UserRound } from "lucide-react";
import { useStore } from "../../components/StoreContext";

const EMPTY_ADDRESS = {
  label: "Home",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthLoading, refreshAuthSession, logout } = useStore();
  const [account, setAccount] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [editingAddressId, setEditingAddressId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/account/login?redirect=/account");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    async function loadAccount() {
      if (!user) return;
      setLoading(true);
      try {
        const response = await fetch("/api/account", { cache: "no-store" });
        const data = await response.json();
        if (response.ok) {
          setAccount(data.user);
          setProfileForm({ name: data.user.name || "", phone: data.user.phone || "" });
        }
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [user]);

  function setProfileField(field, value) {
    setProfileForm((current) => ({ ...current, [field]: value }));
  }

  function setAddressField(field, value) {
    setAddressForm((current) => ({ ...current, [field]: value }));
  }

  async function patchAccount(updates) {
    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not update account.");
    setAccount(data.user);
    await refreshAuthSession?.();
    return data.user;
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await patchAccount(profileForm);
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveAddress(event) {
    event.preventDefault();
    if (!account) return;

    setSaving(true);
    setMessage("");
    const nextAddress = {
      ...addressForm,
      id: editingAddressId || `addr_${Date.now()}`,
    };
    const currentAddresses = Array.isArray(account.addresses) ? account.addresses : [];
    const addresses = editingAddressId
      ? currentAddresses.map((address) => address.id === editingAddressId ? nextAddress : address)
      : [...currentAddresses, nextAddress];

    try {
      await patchAccount({ addresses });
      setAddressForm(EMPTY_ADDRESS);
      setEditingAddressId("");
      setMessage(editingAddressId ? "Address updated." : "Address added.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteAddress(id) {
    if (!account) return;
    setSaving(true);
    setMessage("");
    try {
      await patchAccount({
        addresses: (account.addresses || []).filter((address) => address.id !== id),
      });
      setMessage("Address removed.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function editAddress(address) {
    setEditingAddressId(address.id);
    setAddressForm({
      label: address.label || "Home",
      name: address.name || "",
      phone: address.phone || "",
      line1: address.line1 || "",
      line2: address.line2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    });
    document.getElementById("address-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  if (isAuthLoading || loading || !account) {
    return (
      <main className="account-page">
        <div className="account-container">
          <p className="account-loading">Loading account...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page">
      <div className="account-container">
        <header className="account-header">
          <div>
            <span className="auth-eyebrow">Customer Account</span>
            <h1>Welcome, {account.name}</h1>
            <p>{account.email}</p>
          </div>
          <button className="account-logout" type="button" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </header>

        {message ? <p className="account-message">{message}</p> : null}

        <section className="account-grid">
          <form className="account-card" onSubmit={saveProfile}>
            <div className="account-card-header">
              <UserRound size={22} />
              <div>
                <h2>Profile</h2>
                <p>Used for saved checkout details and support.</p>
              </div>
            </div>
            <label>
              <span>Name</span>
              <input value={profileForm.name} onChange={(event) => setProfileField("name", event.target.value)} required />
            </label>
            <label>
              <span>Email</span>
              <input value={account.email} disabled />
            </label>
            <label>
              <span>Phone</span>
              <input value={profileForm.phone} onChange={(event) => setProfileField("phone", event.target.value)} />
            </label>
            <button className="account-primary" type="submit" disabled={saving}>
              <Save size={16} />
              Save Profile
            </button>
          </form>

          <section className="account-card">
            <div className="account-card-header">
              <Home size={22} />
              <div>
                <h2>Account Tools</h2>
                <p>Quick access to customer self-service.</p>
              </div>
            </div>
            <div className="account-link-list">
              <Link href="/orders/cancel">
                <PackageX size={16} />
                Cancel product order
              </Link>
              <Link href="/returns/track">Track a return</Link>
              <Link href="/shop">Continue shopping</Link>
              <Link href="/cart">View cart</Link>
            </div>
          </section>
        </section>

        <section className="account-address-section" id="addresses">
          <div className="account-section-heading">
            <div>
              <span className="auth-eyebrow">Delivery Details</span>
              <h2>Saved addresses</h2>
            </div>
          </div>

          <div className="account-address-grid">
            <form className="account-card" id="address-form" onSubmit={saveAddress}>
              <div className="account-card-header">
                <MapPin size={22} />
                <div>
                  <h2>{editingAddressId ? "Edit address" : "Add address"}</h2>
                  <p>Keep delivery details ready for future orders.</p>
                </div>
              </div>
              <div className="account-two-col">
                <label>
                  <span>Label</span>
                  <input value={addressForm.label} onChange={(event) => setAddressField("label", event.target.value)} />
                </label>
                <label>
                  <span>Recipient</span>
                  <input value={addressForm.name} onChange={(event) => setAddressField("name", event.target.value)} required />
                </label>
              </div>
              <label>
                <span>Phone</span>
                <input value={addressForm.phone} onChange={(event) => setAddressField("phone", event.target.value)} required />
              </label>
              <label>
                <span>Address line 1</span>
                <input value={addressForm.line1} onChange={(event) => setAddressField("line1", event.target.value)} required />
              </label>
              <label>
                <span>Address line 2</span>
                <input value={addressForm.line2} onChange={(event) => setAddressField("line2", event.target.value)} />
              </label>
              <div className="account-two-col">
                <label>
                  <span>City</span>
                  <input value={addressForm.city} onChange={(event) => setAddressField("city", event.target.value)} required />
                </label>
                <label>
                  <span>State</span>
                  <input value={addressForm.state} onChange={(event) => setAddressField("state", event.target.value)} required />
                </label>
              </div>
              <label>
                <span>Pincode</span>
                <input value={addressForm.pincode} onChange={(event) => setAddressField("pincode", event.target.value)} required />
              </label>
              <div className="account-actions-row">
                {editingAddressId ? (
                  <button
                    className="account-secondary"
                    type="button"
                    onClick={() => {
                      setEditingAddressId("");
                      setAddressForm(EMPTY_ADDRESS);
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
                <button className="account-primary" type="submit" disabled={saving}>
                  <Plus size={16} />
                  {editingAddressId ? "Save Address" : "Add Address"}
                </button>
              </div>
            </form>

            <div className="account-address-list">
              {(account.addresses || []).length === 0 ? (
                <div className="account-empty-card">No saved addresses yet.</div>
              ) : (
                account.addresses.map((address) => (
                  <article className="account-address-card" key={address.id}>
                    <strong>{address.label}</strong>
                    <p>{address.name} - {address.phone}</p>
                    <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                    <p>{address.city}, {address.state} {address.pincode}</p>
                    <div className="account-actions-row">
                      <button className="account-secondary" type="button" onClick={() => editAddress(address)}>
                        Edit
                      </button>
                      <button className="account-danger" type="button" onClick={() => deleteAddress(address.id)}>
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
