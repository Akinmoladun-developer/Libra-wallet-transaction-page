import React from "react";
import { formatNGN, formatDateLabel } from "../utils/formatters";

// Type & status display configuration
const TYPE_CONFIG = {
  funding:  { label: "Wallet funding",  background: "#E1F5EE", color: "#085041", icon: "↓" },
  debit:    { label: "Shipment debit",  background: "#FAECE7", color: "#712B13", icon: "↑" },
  refund:   { label: "Refund",          background: "#E6F1FB", color: "#0C447C", icon: "↺" },
  reversal: { label: "Reversal",        background: "#FAEEDA", color: "#633806", icon: "⇄" },
};

const STATUS_CONFIG = {
  success: { label: "Successful", background: "#EAF3DE", color: "#27500A" },
  pending: { label: "Pending",    background: "#FAEEDA", color: "#633806" },
  failed:  { label: "Failed",     background: "#FCEBEB", color: "#791F1F" },
};

// Timeline steps per status
const getTimeline = (txn) => {
  const base = [
    {
      state: "done",
      label: "Transaction initiated",
      time: `${formatDateLabel(txn.date)} · ${txn.time}`,
    },
    {
      state: "done",
      label: "Validation passed",
      time: `${formatDateLabel(txn.date)} · ${txn.time}`,
    },
  ];

  if (txn.status === "success") {
    return [
      ...base,
      {
        state: "done",
        label: "Wallet balance updated",
        time: `${formatDateLabel(txn.date)} · ${txn.time}`,
      },
      {
        state: "done",
        label: "Transaction completed",
        time: `${formatDateLabel(txn.date)} · ${txn.time}`,
      },
    ];
  }

  if (txn.status === "pending") {
    return [
      ...base,
      {
        state: "pending",
        label: "Awaiting settlement",
        time: "In progress…",
      },
      {
        state: "waiting",
        label: "Balance update",
        time: "Pending",
      },
    ];
  }

  if (txn.status === "failed") {
    return [
      ...base,
      {
        state: "failed",
        label: "Settlement failed",
        time: `${formatDateLabel(txn.date)} · ${txn.time}`,
      },
      {
        state: "waiting",
        label: "Balance update",
        time: "Not completed",
      },
    ];
  }

  return base;
};

// Timeline dot color 
const DOT_COLOR = {
  done:    "#639922",
  pending: "#EF9F27",
  failed:  "#E24B4A",
  waiting: "#c8c7c0",
};

// Small inline badge
function InlineBadge({ config }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 9px",
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 500,
      background: config.background,
      color: config.color,
    }}>
      {config.icon && `${config.icon} `}{config.label}
    </span>
  );
}

// Single detail field
function DetailField({ label, children }) {
  return (
    <div style={styles.field}>
      <div style={styles.fieldLabel}>{label}</div>
      <div style={styles.fieldValue}>{children}</div>
    </div>
  );
}

// Main component
export default function DetailPanel({ txn, onClose }) {
  if (!txn) return null;

  const typeConfig   = TYPE_CONFIG[txn.type]   || { label: txn.type,   background: "#f0efe9", color: "#444" };
  const statusConfig = STATUS_CONFIG[txn.status] || { label: txn.status, background: "#f0efe9", color: "#444" };
  const timeline     = getTimeline(txn);
  const isCredit     = txn.dir === "cr";

  return (
    <div style={styles.panel}>

      {/* ── Panel header ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.panelTitle}>Transaction detail</span>
          <span style={styles.txnIdBadge}>{txn.id}</span>
          <InlineBadge config={typeConfig} />
        </div>
        <button style={styles.closeBtn} onClick={onClose}>
          ✕ Close
        </button>
      </div>

      {/* ── Section: Core transaction info ── */}
      <div style={styles.sectionLabel}>Core information</div>
      <div style={styles.grid}>
        <DetailField label="Transaction ID">
          <span style={styles.mono}>{txn.id}</span>
        </DetailField>

        <DetailField label="Date">
          {formatDateLabel(txn.date)}
        </DetailField>

        <DetailField label="Time">
          {txn.time}
        </DetailField>

        <DetailField label="Transaction type">
          <InlineBadge config={typeConfig} />
        </DetailField>

        <DetailField label="Status">
          <InlineBadge config={statusConfig} />
        </DetailField>

        <DetailField label="Initiated by">
          <span style={styles.initiatedBadge}>{txn.initiatedBy}</span>
        </DetailField>
      </div>

      <div style={styles.divider} />

      {/* ── Section: Financial details ── */}
      <div style={styles.sectionLabel}>Financial details</div>
      <div style={styles.grid}>
        <DetailField label="Amount">
          <span style={{
            fontSize: 15,
            fontWeight: 700,
            color: isCredit ? "#0F6E56" : "#993C1D",
          }}>
            {isCredit ? "+" : "−"}{formatNGN(txn.amount)}
          </span>
        </DetailField>

        <DetailField label="Direction">
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: isCredit ? "#0F6E56" : "#993C1D",
          }}>
            {isCredit ? "↓ Credit (money in)" : "↑ Debit (money out)"}
          </span>
        </DetailField>

        <DetailField label="Payment method">
          {txn.method}
        </DetailField>

        <DetailField label="Balance before">
          <span style={{ color: txn.balBefore < 0 ? "#993C1D" : "#1a1a18" }}>
            {txn.balBefore < 0 ? "−" : ""}{formatNGN(txn.balBefore)}
          </span>
        </DetailField>

        <DetailField label="Balance after">
          <span style={{ color: txn.balAfter < 0 ? "#993C1D" : "#1a1a18" }}>
            {txn.balAfter < 0 ? "−" : ""}{formatNGN(txn.balAfter)}
          </span>
        </DetailField>

        <DetailField label="Reference / proof">
          <span style={styles.mono}>{txn.ref || "—"}</span>
        </DetailField>
      </div>

      <div style={styles.divider} />

      {/* ── Section: Shipment & merchant ── */}
      <div style={styles.sectionLabel}>Shipment & merchant</div>
      <div style={styles.grid}>
        <DetailField label="Description">
          <span style={{ fontSize: 12, lineHeight: 1.5 }}>{txn.desc}</span>
        </DetailField>

        <DetailField label="Linked shipment ID">
          {txn.shipment ? (
            <span style={styles.shipLink}>{txn.shipment}</span>
          ) : (
            <span style={styles.dash}>No shipment linked</span>
          )}
        </DetailField>

        <DetailField label="Merchant ID">
          <span style={styles.mono}>MID-004821</span>
        </DetailField>

        <DetailField label="Merchant name">
          Adeyemi Stores
        </DetailField>

        <DetailField label="Merchant location">
          Lagos, Nigeria
        </DetailField>

        <DetailField label="Merchant tier">
          <span style={styles.tierBadge}>Gold</span>
        </DetailField>
      </div>

      <div style={styles.divider} />

      {/* ── Section: Processing timeline ── */}
      <div style={styles.sectionLabel}>Processing timeline</div>
      <div style={styles.timeline}>
        {timeline.map((step, idx) => (
          <div key={idx} style={styles.timelineRow}>
            {/* Dot + connecting line */}
            <div style={styles.dotCol}>
              <div style={{
                ...styles.dot,
                background: DOT_COLOR[step.state],
                boxShadow: step.state === "pending"
                  ? `0 0 0 3px #FAEEDA`
                  : "none",
              }} />
              {idx < timeline.length - 1 && (
                <div style={{
                  ...styles.line,
                  background: step.state === "done" ? "#C0DD97" : "#e0dfd9",
                }} />
              )}
            </div>

            {/* Step text */}
            <div style={styles.stepContent}>
              <div style={{
                ...styles.stepLabel,
                color: step.state === "waiting"
                  ? "#9e9d99"
                  : "#1a1a18",
              }}>
                {step.label}
              </div>
              <div style={{
                ...styles.stepTime,
                color: step.state === "pending"
                  ? "#EF9F27"
                  : step.state === "failed"
                  ? "#E24B4A"
                  : "#9e9d99",
              }}>
                {step.time}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// Styles
const styles = {
  panel: {
    background: "#ffffff",
    border: "0.5px solid #e0dfd9",
    borderRadius: 12,
    padding: "18px 20px",
    marginTop: 12,
    marginBottom: 12,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottom: "0.5px solid #e0dfd9",
    flexWrap: "wrap",
    gap: 10,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1a1a18",
  },
  txnIdBadge: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#6b6b68",
    background: "#f6f5f2",
    padding: "2px 8px",
    borderRadius: 6,
    border: "0.5px solid #e0dfd9",
  },
  closeBtn: {
    fontSize: 12,
    padding: "6px 12px",
    borderRadius: 8,
    border: "0.5px solid #c8c7c0",
    background: "transparent",
    color: "#6b6b68",
    cursor: "pointer",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: "#6b6b68",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 12,
    marginTop: 2,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px 20px",
    marginBottom: 4,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  fieldLabel: {
    fontSize: 11,
    color: "#9e9d99",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: 500,
    color: "#1a1a18",
  },
  divider: {
    height: "0.5px",
    background: "#e0dfd9",
    margin: "16px 0",
  },
  mono: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#444",
  },
  initiatedBadge: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 99,
    background: "#f6f5f2",
    border: "0.5px solid #e0dfd9",
    color: "#6b6b68",
  },
  shipLink: {
    color: "#185FA5",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },
  dash: {
    color: "#9e9d99",
    fontSize: 12,
  },
  tierBadge: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 99,
    background: "#FAEEDA",
    color: "#633806",
    border: "0.5px solid #FAC775",
    fontWeight: 500,
  },
  // ── Timeline ──
  timeline: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: 4,
  },
  timelineRow: {
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
  },
  dotCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
    width: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
    marginTop: 3,
  },
  line: {
    width: 2,
    height: 28,
    borderRadius: 2,
    marginTop: 3,
  },
  stepContent: {
    paddingBottom: 20,
    flex: 1,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.4,
  },
  stepTime: {
    fontSize: 11,
    marginTop: 2,
  },
};