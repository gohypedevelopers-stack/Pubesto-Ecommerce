"use client";

import "../../returns.css";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, RefreshCw, ArrowLeft, RotateCcw } from "lucide-react";

const STATUS_FLOW = [
  { id: "pending", label: "Request Submitted", icon: "📋", desc: "Your return request has been received." },
  { id: "under_review", label: "Under Review", icon: "🔍", desc: "Our team is reviewing your request." },
  { id: "approved", label: "Return Approved", icon: "✅", desc: "Return approved — please ship it back." },
  { id: "refund_initiated", label: "Refund Initiated", icon: "💰", desc: "Refund processing (5–10 business days)." },
];

const REJECTION_FLOW = [
  { id: "pending", label: "Request Submitted", icon: "📋" },
  { id: "under_review", label: "Under Review", icon: "🔍" },
  { id: "rejected", label: "Return Rejected", icon: "❌" },
];

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const REASON_MAP = {
  damaged_defective: "Damaged / Defective",
  wrong_item: "Wrong Item Delivered",
  not_as_described: "Not As Described",
  changed_mind: "Changed My Mind",
  quality_issue: "Quality Issue",
  other: "Other",
};

function StatusBadge({ status }) {
  const labels = {
    pending: "⏳ Pending",
    under_review: "🔍 Under Review",
    approved: "✅ Approved",
    rejected: "❌ Rejected",
    refund_initiated: "💰 Refund Initiated",
  };
  return (
    <span className={`returns-status-badge ${status}`}>
      {labels[status] || status}
    </span>
  );
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [inputId, setInputId] = useState(initialId);
  const [searchId, setSearchId] = useState(initialId);
  const [returnData, setReturnData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  async function fetchReturn(id) {
    if (!id.trim()) {
      setError("Please enter a Return ID.");
      return;
    }
    setLoading(true);
    setError("");
    setReturnData(null);

    try {
      const res = await fetch(`/api/returns?id=${encodeURIComponent(id.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Return request not found.");
        return;
      }
      setReturnData(data);
      setSearchId(id.trim());
    } catch (err) {
      setError("Failed to load return status. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-fetch if ID in URL
  useEffect(() => {
    if (initialId) {
      fetchReturn(initialId);
    }
  }, []);

  async function handleRefresh() {
    if (!searchId) return;
    setRefreshing(true);
    await fetchReturn(searchId);
    setRefreshing(false);
  }

  // Determine which flow to show
  const isRejected = returnData?.status === "rejected";
  const flow = isRejected ? REJECTION_FLOW : STATUS_FLOW;

  function getStepState(stepId) {
    if (!returnData) return "pending";
    const status = returnData.status;
    const flowIds = flow.map((f) => f.id);
    const currentIdx = flowIds.indexOf(status);
    const stepIdx = flowIds.indexOf(stepId);

    if (stepIdx < currentIdx) return "completed";
    if (stepIdx === currentIdx) return "active";
    return "upcoming";
  }

  return (
    <main className="returns-page">
      <div className="returns-container">
        {/* Header */}
        <header className="returns-page-header">
          <div className="returns-badge">
            <span className="returns-badge-dot" />
            Return Tracker
          </div>
          <h1 className="returns-page-title">Track Your Return</h1>
          <p className="returns-page-subtitle">
            Enter your Return ID (e.g., <code style={{ fontFamily: "monospace", fontWeight: 700 }}>RET-847291</code>) to
            check the current status of your return request.
          </p>
        </header>

        {/* Search Bar */}
        <div className="returns-card" style={{ marginBottom: "24px" }}>
          <div className="returns-track-lookup">
            <input
              id="track-return-id"
              className="returns-input"
              type="text"
              placeholder="Enter Return ID (e.g. RET-847291)"
              value={inputId}
              onChange={(e) => setInputId(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchReturn(inputId);
              }}
              style={{ fontFamily: "monospace", letterSpacing: "0.04em" }}
            />
            <button
              className="returns-btn-primary"
              onClick={() => fetchReturn(inputId)}
              disabled={loading}
              id="track-search-btn"
              style={{ whiteSpace: "nowrap" }}
            >
              {loading ? "Looking up…" : (
                <>
                  <Search size={16} /> Track Return
                </>
              )}
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(229,62,62,0.07)",
                border: "1px solid rgba(229,62,62,0.2)",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#c53030",
                marginTop: "4px",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {returnData && (
          <>
            {/* Summary */}
            <div className="returns-card" style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <p className="returns-modal-section-title" style={{ marginBottom: "6px" }}>
                    Return Request
                  </p>
                  <h2
                    style={{
                      fontFamily: "monospace",
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "var(--brand-color, #1b624b)",
                      margin: 0,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {returnData.id}
                  </h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <StatusBadge status={returnData.status} />
                  <button
                    className="returns-btn-secondary"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    style={{ padding: "6px 12px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}
                    title="Refresh status"
                  >
                    <RefreshCw size={13} className={refreshing ? "spin" : ""} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="returns-info-grid">
                <div className="returns-info-item">
                  <p className="returns-info-label">Order ID</p>
                  <p className="returns-info-value">{returnData.orderId}</p>
                </div>
                <div className="returns-info-item">
                  <p className="returns-info-label">Customer Email</p>
                  <p className="returns-info-value" style={{ fontSize: "13px" }}>
                    {returnData.customerEmail}
                  </p>
                </div>
                <div className="returns-info-item">
                  <p className="returns-info-label">Return Reason</p>
                  <p className="returns-info-value">
                    {REASON_MAP[returnData.reason] || returnData.reason}
                  </p>
                </div>
                <div className="returns-info-item">
                  <p className="returns-info-label">Submitted On</p>
                  <p className="returns-info-value" style={{ fontSize: "12.5px" }}>
                    {formatDate(returnData.submittedAt)}
                  </p>
                </div>
              </div>

              {/* Admin note to customer (public) */}
              {returnData.adminNotes && (
                <div
                  style={{
                    background: "rgba(27,98,75,0.05)",
                    border: "1px solid rgba(27,98,75,0.15)",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    marginTop: "8px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginBottom: "6px",
                    }}
                  >
                    Message from Pubesto
                  </p>
                  <p style={{ fontSize: "13.5px", color: "var(--ink)", margin: 0, lineHeight: 1.55 }}>
                    {returnData.adminNotes}
                  </p>
                </div>
              )}

              {/* Rejection reason */}
              {returnData.status === "rejected" && returnData.rejectionReason && (
                <div
                  style={{
                    background: "rgba(229,62,62,0.05)",
                    border: "1px solid rgba(229,62,62,0.2)",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    marginTop: "12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: "#c53030",
                      marginBottom: "6px",
                    }}
                  >
                    Rejection Reason
                  </p>
                  <p style={{ fontSize: "13.5px", color: "var(--ink)", margin: 0, lineHeight: 1.55 }}>
                    {returnData.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="returns-card">
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  margin: "0 0 24px",
                }}
              >
                Return Timeline
              </h3>

              <div className="returns-timeline">
                {flow.map((step) => {
                  const state = getStepState(step.id);
                  const timelineEntry = returnData.timeline?.find((t) => t.status === step.id);
                  const isRejectedStep = step.id === "rejected";

                  return (
                    <div
                      key={step.id}
                      className={`returns-timeline-item${state === "completed" || state === "active" ? " completed" : ""}${state === "active" ? " active" : ""}${isRejectedStep && state === "active" ? " rejected" : ""}`}
                    >
                      <div
                        className={`returns-timeline-dot${isRejectedStep && (state === "active" || state === "completed") ? " rejected" : ""}`}
                        style={isRejectedStep && state !== "upcoming" ? { background: "#e53e3e", borderColor: "#e53e3e", color: "#fff" } : {}}
                      >
                        {state === "completed" || state === "active" ? step.icon : "○"}
                      </div>

                      <div className="returns-timeline-content">
                        <p className="returns-timeline-label">{step.label}</p>
                        {timelineEntry && (
                          <p className="returns-timeline-date">{formatDate(timelineEntry.date)}</p>
                        )}
                        {timelineEntry?.note && (
                          <p
                            className={`returns-timeline-note${isRejectedStep ? " rejected" : ""}`}
                          >
                            {timelineEntry.note}
                          </p>
                        )}
                        {!timelineEntry && state === "upcoming" && (
                          <p className="returns-timeline-date" style={{ fontStyle: "italic" }}>
                            Pending…
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
              <Link
                href="/returns"
                className="returns-btn-secondary"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <RotateCcw size={15} /> New Return Request
              </Link>
              <a
                href="mailto:support@pubesto.com"
                className="returns-btn-secondary"
                style={{ textDecoration: "none" }}
              >
                Contact Support
              </a>
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && !returnData && !error && !initialId && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              color: "var(--muted)",
            }}
          >
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>📦</div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)", marginBottom: "8px" }}>
              Enter your Return ID above
            </p>
            <p style={{ fontSize: "13px", lineHeight: 1.6, maxWidth: "320px", margin: "0 auto" }}>
              Your Return ID was shown after you submitted your return request
              (format: RET-XXXXXX).
            </p>
            <Link
              href="/returns"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "24px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--brand-color, #1b624b)",
                textDecoration: "none",
              }}
            >
              <RotateCcw size={15} /> Submit a new return request
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </main>
  );
}

export default function ReturnTrackPage() {
  return (
    <Suspense
      fallback={
        <main className="returns-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--muted)" }}>Loading…</p>
        </main>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
