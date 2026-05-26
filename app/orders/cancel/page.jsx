"use client";

import "../../returns.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, PackageX } from "lucide-react";

const CANCELLATION_REASONS = [
  { id: "ordered_by_mistake", label: "Ordered by mistake" },
  { id: "wrong_product", label: "Wrong product or variant" },
  { id: "delivery_timing", label: "Delivery timing issue" },
  { id: "found_alternative", label: "Found another option" },
  { id: "payment_issue", label: "Payment or billing issue" },
  { id: "other", label: "Other" },
];

const EMPTY_FORM = {
  orderId: "",
  customerEmail: "",
  customerName: "",
  customerPhone: "",
  productName: "",
  reason: "",
  reasonText: "",
  agreePolicy: false,
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export default function CancelOrderPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [cancellationId, setCancellationId] = useState("");

  useEffect(() => {
    async function prefillAccount() {
      try {
        const response = await fetch("/api/account", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        const user = data.user;
        if (!user) return;

        setForm((current) => ({
          ...current,
          customerName: current.customerName || user.name || "",
          customerEmail: current.customerEmail || user.email || "",
          customerPhone: current.customerPhone || user.phone || "",
        }));
      } catch {
        // The form remains usable for guests.
      }
    }

    prefillAccount();
  }, []);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setApiError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.orderId.trim()) nextErrors.orderId = "Order ID is required.";
    if (!form.customerName.trim()) nextErrors.customerName = "Full name is required.";
    if (!isValidEmail(form.customerEmail)) nextErrors.customerEmail = "Enter a valid checkout email.";
    if (!form.reason) nextErrors.reason = "Select a cancellation reason.";
    if (form.reason === "other" && !form.reasonText.trim()) {
      nextErrors.reasonText = "Please describe why you want to cancel.";
    }
    if (!form.agreePolicy) {
      nextErrors.agreePolicy = "Confirm that you understand cancellation depends on dispatch status.";
    }

    return nextErrors;
  }

  async function submitCancellation(event) {
    event.preventDefault();
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    const payload = {
      orderId: form.orderId.trim(),
      customerEmail: form.customerEmail.trim(),
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      productName: form.productName.trim(),
      reason: form.reason,
      reasonText: form.reasonText.trim(),
    };

    try {
      const response = await fetch("/api/order-cancellations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.existingId) {
          setApiError(`A cancellation request already exists. Request ID: ${data.existingId}`);
        } else {
          setApiError(data.error || "Could not submit cancellation request.");
        }
        return;
      }

      setCancellationId(data.cancellationId);
      try {
        const saved = JSON.parse(localStorage.getItem("pubesto_cancellations") || "[]");
        saved.push({ ...payload, id: data.cancellationId, status: "requested", createdAt: new Date().toISOString() });
        localStorage.setItem("pubesto_cancellations", JSON.stringify(saved));
      } catch {
        // Local backup is optional.
      }
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (cancellationId) {
    return (
      <main className="returns-page">
        <div className="returns-container">
          <div className="returns-card" style={{ textAlign: "center" }}>
            <div className="returns-confirm-icon">
              <CheckCircle2 size={34} />
            </div>
            <h1 className="returns-card-title">Cancellation Request Submitted</h1>
            <p style={{ fontSize: "14px", color: "var(--muted, #7a7266)", marginBottom: "8px" }}>
              Your cancellation request ID is:
            </p>
            <div className="returns-confirm-id">{cancellationId}</div>
            <p
              style={{
                fontSize: "13.5px",
                color: "var(--muted, #7a7266)",
                lineHeight: 1.65,
                maxWidth: "440px",
                margin: "0 auto 24px",
              }}
            >
              Our team will confirm whether this order can be cancelled before dispatch.
              Refunds for eligible prepaid orders are processed to the original payment method.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/account" className="returns-btn-primary" style={{ textDecoration: "none" }}>
                Back to Account
              </Link>
              <Link href="/shop" className="returns-btn-secondary" style={{ textDecoration: "none" }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="returns-page">
      <div className="returns-container">
        <header className="returns-page-header">
          <div className="returns-badge">
            <span className="returns-badge-dot" />
            Before Dispatch
          </div>
          <h1 className="returns-page-title">Cancel an Order</h1>
          <p className="returns-page-subtitle">
            Submit your cancellation request with the order details from your confirmation email.
            Our team will verify dispatch status and respond as soon as possible.
          </p>
        </header>

        <form className="returns-card" onSubmit={submitCancellation}>
          <div className="account-card-header" style={{ marginBottom: "20px" }}>
            <PackageX size={24} />
            <div>
              <h2 className="returns-card-title">Order details</h2>
              <p className="returns-card-desc" style={{ margin: "4px 0 0" }}>
                Cancellations are available only before the order has shipped.
              </p>
            </div>
          </div>

          <div className="returns-field-group">
            <div className="returns-field">
              <label className="returns-label" htmlFor="cancel-order-id">
                Order ID <span>*</span>
              </label>
              <input
                id="cancel-order-id"
                className={`returns-input${errors.orderId ? " error" : ""}`}
                type="text"
                placeholder="e.g. #1234 or ORD-5678"
                value={form.orderId}
                onChange={(event) => setField("orderId", event.target.value)}
              />
              {errors.orderId ? <span className="returns-field-error">{errors.orderId}</span> : null}
            </div>
          </div>

          <div className="returns-field-group two-col">
            <div className="returns-field">
              <label className="returns-label" htmlFor="cancel-name">
                Full Name <span>*</span>
              </label>
              <input
                id="cancel-name"
                className={`returns-input${errors.customerName ? " error" : ""}`}
                type="text"
                value={form.customerName}
                onChange={(event) => setField("customerName", event.target.value)}
              />
              {errors.customerName ? <span className="returns-field-error">{errors.customerName}</span> : null}
            </div>

            <div className="returns-field">
              <label className="returns-label" htmlFor="cancel-email">
                Checkout Email <span>*</span>
              </label>
              <input
                id="cancel-email"
                className={`returns-input${errors.customerEmail ? " error" : ""}`}
                type="email"
                value={form.customerEmail}
                onChange={(event) => setField("customerEmail", event.target.value)}
              />
              {errors.customerEmail ? <span className="returns-field-error">{errors.customerEmail}</span> : null}
            </div>
          </div>

          <div className="returns-field-group two-col">
            <div className="returns-field">
              <label className="returns-label" htmlFor="cancel-phone">
                Phone Number
              </label>
              <input
                id="cancel-phone"
                className="returns-input"
                type="tel"
                placeholder="+91 XXXXXXXXXX"
                value={form.customerPhone}
                onChange={(event) => setField("customerPhone", event.target.value)}
              />
            </div>

            <div className="returns-field">
              <label className="returns-label" htmlFor="cancel-product">
                Product Name
              </label>
              <input
                id="cancel-product"
                className="returns-input"
                type="text"
                placeholder="Optional"
                value={form.productName}
                onChange={(event) => setField("productName", event.target.value)}
              />
            </div>
          </div>

          <div className="returns-field-group">
            <div className="returns-field">
              <label className="returns-label" htmlFor="cancel-reason">
                Cancellation Reason <span>*</span>
              </label>
              <select
                id="cancel-reason"
                className={`returns-select${errors.reason ? " error" : ""}`}
                value={form.reason}
                onChange={(event) => setField("reason", event.target.value)}
              >
                <option value="">Select a reason</option>
                {CANCELLATION_REASONS.map((reason) => (
                  <option key={reason.id} value={reason.id}>
                    {reason.label}
                  </option>
                ))}
              </select>
              {errors.reason ? <span className="returns-field-error">{errors.reason}</span> : null}
            </div>
          </div>

          <div className="returns-field">
            <label className="returns-label" htmlFor="cancel-notes">
              Additional Details{form.reason === "other" ? <span> *</span> : null}
            </label>
            <textarea
              id="cancel-notes"
              className={`returns-textarea${errors.reasonText ? " error" : ""}`}
              rows={4}
              placeholder="Add any detail that can help us identify the order."
              value={form.reasonText}
              onChange={(event) => setField("reasonText", event.target.value)}
            />
            {errors.reasonText ? <span className="returns-field-error">{errors.reasonText}</span> : null}
          </div>

          <label className="returns-policy-check">
            <input
              type="checkbox"
              checked={form.agreePolicy}
              onChange={(event) => setField("agreePolicy", event.target.checked)}
            />
            <span>
              I understand cancellation is confirmed only if the order has not been dispatched.
            </span>
          </label>
          {errors.agreePolicy ? <p className="returns-field-error">{errors.agreePolicy}</p> : null}

          {apiError ? (
            <div className="returns-inline-error">
              {apiError}
            </div>
          ) : null}

          <div className="returns-btn-row">
            <Link href="/account" className="returns-btn-secondary" style={{ textDecoration: "none" }}>
              <ArrowLeft size={15} /> Back
            </Link>
            <button className="returns-btn-primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Cancellation"}
              {!loading ? <ArrowRight size={16} /> : null}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
