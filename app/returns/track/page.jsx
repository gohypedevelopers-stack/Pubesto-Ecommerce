"use client";

import "../../returns.css";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  RefreshCw, 
  ArrowLeft, 
  RotateCcw,
  ClipboardList,
  CheckCircle2,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  Mail,
  Clock,
  Copy,
  Check,
  Info,
  Hash,
  MessageSquare
} from "lucide-react";

const STATUS_FLOW = [
  { id: "pending", label: "Request Submitted", icon: ClipboardList, desc: "Your return request has been received." },
  { id: "under_review", label: "Under Review", icon: Search, desc: "Our team is reviewing your request." },
  { id: "approved", label: "Return Approved", icon: CheckCircle2, desc: "Return approved — please ship it back." },
  { id: "refund_initiated", label: "Refund Initiated", icon: CreditCard, desc: "Refund processing (5–10 business days)." },
];

const REJECTION_FLOW = [
  { id: "pending", label: "Request Submitted", icon: ClipboardList },
  { id: "under_review", label: "Under Review", icon: Search },
  { id: "rejected", label: "Return Rejected", icon: AlertTriangle },
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

  // Local storage returns tracking list
  const [returnsList, setReturnsList] = useState([]);
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pubesto_returns") || "[]");
      setReturnsList(saved);
    } catch {
      // Optional
    }
  }, []);

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
      setInputId(id.trim());

      // Save to localStorage for dynamic sidebar tracking
      try {
        const saved = JSON.parse(localStorage.getItem("pubesto_returns") || "[]");
        if (!saved.some((item) => item.id === data.id)) {
          saved.push({
            id: data.id,
            orderId: data.orderId,
            customerEmail: data.customerEmail,
            createdAt: data.submittedAt || new Date().toISOString()
          });
          localStorage.setItem("pubesto_returns", JSON.stringify(saved));
          setReturnsList(saved);
        }
      } catch {
        // Local backup is optional
      }
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
  }, [initialId]);

  async function handleRefresh() {
    if (!searchId) return;
    setRefreshing(true);
    await fetchReturn(searchId);
    setRefreshing(false);
  }

  const handleCopy = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

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

        <div className="returns-layout-grid">
          {/* Main Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            
            {/* Search Bar */}
            <div className="returns-card" style={{ padding: "30px 24px" }}>
              <div className="returns-field" style={{ margin: 0 }}>
                <label className="returns-label" htmlFor="track-return-id">
                  Return Request ID
                </label>
                <div className="returns-track-lookup" style={{ margin: 0, gap: "10px" }}>
                  <div className="cancel-input-wrapper">
                    <span className="cancel-input-icon">
                      <Hash size={16} />
                    </span>
                    <input
                      id="track-return-id"
                      className="returns-input"
                      type="text"
                      placeholder="e.g. RET-847291"
                      value={inputId}
                      onChange={(e) => setInputId(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") fetchReturn(inputId);
                      }}
                      style={{ fontFamily: "monospace", letterSpacing: "0.04em" }}
                    />
                  </div>
                  <button
                    className="returns-btn-primary"
                    onClick={() => fetchReturn(inputId)}
                    disabled={loading}
                    id="track-search-btn"
                    style={{ whiteSpace: "nowrap", height: "46px" }}
                  >
                    {loading ? "Looking up…" : (
                      <>
                        <Search size={16} /> Track Return
                      </>
                    )}
                  </button>
                </div>
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
                    marginTop: "16px",
                  }}
                >
                  {error}
                </div>
              )}
            </div>

            {/* Results Section */}
            {returnData ? (
              <>
                {/* Summary Card */}
                <div className="returns-card">
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
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
                        <button 
                          type="button" 
                          className="cancel-copy-btn" 
                          onClick={(e) => handleCopy(returnData.id, e)}
                          style={{ height: "26px", width: "26px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                        >
                          {copiedId === returnData.id ? <Check size={14} style={{ color: "var(--brand-color)" }} /> : <Copy size={14} />}
                        </button>
                      </div>
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

                  {/* Admin notes (public message) */}
                  {returnData.adminNotes && (
                    <div
                      style={{
                        background: "rgba(27,98,75,0.04)",
                        border: "1px solid rgba(27,98,75,0.15)",
                        borderRadius: "10px",
                        padding: "14px 16px",
                        marginTop: "16px",
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
                        background: "rgba(229,62,62,0.04)",
                        border: "1px solid rgba(229,62,62,0.18)",
                        borderRadius: "10px",
                        padding: "14px 16px",
                        marginTop: "16px",
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

                {/* Timeline Card */}
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
                      const IconComponent = step.icon;

                      return (
                        <div
                          key={step.id}
                          className={`returns-timeline-item${state === "completed" || state === "active" ? " completed" : ""}${state === "active" ? " active" : ""}${isRejectedStep && state === "active" ? " rejected" : ""}`}
                        >
                          <div
                            className={`returns-timeline-dot${isRejectedStep && (state === "active" || state === "completed") ? " rejected" : ""}`}
                            style={{ 
                              background: isRejectedStep && state !== "upcoming" ? "#e53e3e" : "",
                              borderColor: isRejectedStep && state !== "upcoming" ? "#e53e3e" : "",
                              color: isRejectedStep && state !== "upcoming" ? "#fff" : "",
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center" 
                            }}
                          >
                            {state === "completed" || state === "active" ? (
                              <IconComponent size={14} />
                            ) : (
                              <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: "bold" }}>○</span>
                            )}
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
                <div style={{ display: "flex", gap: "12px", marginTop: "4px", flexWrap: "wrap" }}>
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
            ) : null}

            {/* Empty State */}
            {!loading && !returnData && !error && !initialId && (
              <div
                className="returns-card"
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  color: "var(--muted)",
                }}
              >
                <div style={{ fontSize: "52px", marginBottom: "16px" }}>📦</div>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)", marginBottom: "8px" }}>
                  Enter your Return ID above
                </p>
                <p style={{ fontSize: "13.5px", lineHeight: 1.65, maxWidth: "340px", margin: "0 auto 24px" }}>
                  Your Return ID was shown after you successfully submitted your return request (format: RET-XXXXXX).
                </p>
                <Link
                  href="/returns"
                  className="returns-btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                    margin: "0 auto"
                  }}
                >
                  <RotateCcw size={15} /> Submit a new return request
                </Link>
              </div>
            )}

          </div>

          {/* Sidebar Column */}
          <aside className="returns-sidebar">
            
            {/* Local Storage Requests List */}
            {returnsList.length > 0 && (
              <div className="returns-sidebar-card">
                <h3 className="returns-sidebar-title">
                  <ClipboardList size={18} />
                  Your Returns
                </h3>
                <p className="returns-sidebar-desc">
                  Select a previous return request to track its real-time processing status directly from our database.
                </p>
                
                <div className="cancellations-list">
                  {returnsList.map((item) => {
                    const isSelected = returnData?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`cancellation-item-btn ${isSelected ? "selected" : ""}`}
                        type="button"
                        onClick={() => fetchReturn(item.id)}
                      >
                        <div className="cancellation-item-header">
                          <span className="cancellation-item-id">{item.id}</span>
                          <span className="cancellation-item-date">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Recent"}
                          </span>
                        </div>
                        <div className="cancellation-item-detail">
                          Order ID: <strong>{item.orderId}</strong>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Return Policies Dashboard */}
            <div className="returns-sidebar-card">
              <h3 className="returns-sidebar-title">
                <ShieldCheck size={18} />
                Return Policy
              </h3>
              <p className="returns-sidebar-desc">
                Pubesto returns are verified against product delivery dates and conditions before final refund approval.
              </p>
              <div className="cancellation-policy-item">
                <ShieldCheck size={16} className="cancellation-policy-bullet" />
                <span className="cancellation-policy-text">
                  <strong>Verification Window</strong>: Returns must be requested within 7 days of delivery.
                </span>
              </div>
              <div className="cancellation-policy-item">
                <Clock size={16} className="cancellation-policy-bullet" />
                <span className="cancellation-policy-text">
                  <strong>Quality Standard</strong>: Product tags must remain intact, unworn, and in original packaging.
                </span>
              </div>
              <div className="cancellation-policy-item">
                <Mail size={16} className="cancellation-policy-bullet" />
                <span className="cancellation-policy-text">
                  <strong>Processing Time</strong>: Quality audits are completed within 3 days of product receipt.
                </span>
              </div>
            </div>

          </aside>
        </div>
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
