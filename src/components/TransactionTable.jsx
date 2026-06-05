import React from "react";
import { formatNGN, formatDateLabel } from "../utils/formatters";

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

function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || { label: type, background: "#f0efe9", color: "#444", icon: "•" };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 9px",
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 500,
      background: cfg.background,
      color: cfg.color,
      whiteSpace: "nowrap",
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, background: "#f0efe9", color: "#444" };
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 9px",
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 500,
      background: cfg.background,
      color: cfg.color,
      whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  );
}

function AmountCell({ amount, dir }) {
  const isCredit = dir === "cr";
  return (
    <span style={{
      fontWeight: 600,
      fontSize: 12,
      color: isCredit ? "#0F6E56" : "#993C1D",
      whiteSpace: "nowrap",
    }}>
      {isCredit ? "+" : "−"}{formatNGN(amount)}
    </span>
  );
}

function BalanceCell({ value }) {
  return (
    <span style={{
      fontSize: 11,
      color: value < 0 ? "#993C1D" : "#1a1a18",
      whiteSpace: "nowrap",
    }}>
      {value < 0 ? "−" : ""}{formatNGN(value)}
    </span>
  );
}

// This is for Column definitions
const COLUMNS = [
  { key: "id",          label: "TXN ID",      width: 105  },
  { key: "date",        label: "Date & Time",  width: 110  },
  { key: "type",        label: "Type",         width: 135  },
  { key: "desc",        label: "Description",  width: 220  },
  { key: "amount",      label: "Amount (₦)",   width: 130, align: "right" },
  { key: "balBefore",   label: "Bal. Before",  width: 115, align: "right" },
  { key: "balAfter",    label: "Bal. After",   width: 115, align: "right" },
  { key: "status",      label: "Status",       width: 100  },
  { key: "shipment",    label: "Shipment",     width: 95   },
  { key: "method",      label: "Method",       width: 95   },
  { key: "initiatedBy", label: "By",           width: 78   },
];

export default function TransactionTable({ transactions, onRowClick, selectedId }) {
  if (transactions.length === 0) {
    return (
      <div style={styles.emptyWrap}>
        <div style={styles.emptyIcon}>📭</div>
        <div style={styles.emptyText}>No transactions match your filters</div>
        <div style={styles.emptyHint}>Try adjusting or clearing your filters</div>
      </div>
    );
  }

  return (
    <div style={styles.tableWrap}>
      {/* Horizontal scroll wrapper */}
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table style={styles.table}>
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.key} style={{ width: col.width, minWidth: col.width }} />
            ))}
          </colgroup>

          <thead>
            <tr style={styles.headerRow}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{
                    ...styles.th,
                    textAlign: col.align || "left",
                    width: col.width,
                    minWidth: col.width,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {transactions.map((txn, idx) => {
              const isSelected = txn.id === selectedId;
              const isEven     = idx % 2 === 0;

              return (
                <tr
                  key={txn.id}
                  onClick={() => onRowClick(txn)}
                  style={{
                    ...styles.row,
                    background: isSelected
                      ? "#EBF4FF"
                      : isEven ? "#ffffff" : "#fafaf8",
                    borderLeft: isSelected
                      ? "3px solid #185FA5"
                      : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background = "#f0f0eb";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background =
                        isEven ? "#ffffff" : "#fafaf8";
                  }}
                >
                  {/* TXN ID */}
                  <td style={styles.td}>
                    <span style={styles.txnId}>{txn.id}</span>
                  </td>

                  {/* Date & Time */}
                  <td style={styles.td}>
                    <div style={styles.dateMain}>{formatDateLabel(txn.date)}</div>
                    <div style={styles.dateSub}>{txn.time}</div>
                  </td>

                  {/* Type */}
                  <td style={styles.td}>
                    <TypeBadge type={txn.type} />
                  </td>

                  {/* ── Description — KEY FIX ── */}
                  <td style={styles.descTd}>
                    <span style={styles.descText}>{txn.desc}</span>
                  </td>

                  {/* Amount */}
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <AmountCell amount={txn.amount} dir={txn.dir} />
                  </td>

                  {/* Balance Before */}
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <BalanceCell value={txn.balBefore} />
                  </td>

                  {/* Balance After */}
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <BalanceCell value={txn.balAfter} />
                  </td>

                  {/* Status */}
                  <td style={styles.td}>
                    <StatusBadge status={txn.status} />
                  </td>

                  {/* Shipment */}
                  <td style={styles.td}>
                    {txn.shipment
                      ? <span style={styles.shipLink}>{txn.shipment}</span>
                      : <span style={styles.dash}>—</span>}
                  </td>

                  {/* Method */}
                  <td style={styles.td}>
                    <span style={styles.metaText}>{txn.method}</span>
                  </td>

                  {/* Initiated by */}
                  <td style={styles.td}>
                    <span style={styles.metaText}>{txn.initiatedBy}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  tableWrap: {
    border: "0.5px solid #e0dfd9",
    borderRadius: 12,
    overflow: "hidden",
    background: "#ffffff",
    marginBottom: 10,
    width: "100%",
  },
  table: {
    // No fixed table-layout 
    borderCollapse: "collapse",
    fontSize: 12,
    minWidth: "100%",
  },
  headerRow: {
    background: "#f6f5f2",
  },
  th: {
    padding: "10px 12px",
    fontWeight: 500,
    fontSize: 11,
    color: "#6b6b68",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "0.5px solid #e0dfd9",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    background: "#f6f5f2",
    zIndex: 1,
  },
  row: {
    cursor: "pointer",
    transition: "background 0.1s ease",
  },
  td: {
    padding: "11px 12px",
    borderBottom: "0.5px solid #f0efe9",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  // Description cell... the key fix
  descTd: {
    padding: "11px 12px",
    borderBottom: "0.5px solid #f0efe9",
    verticalAlign: "middle",
    // Allow wrapping — no truncation
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight: 1.5,
    minWidth: 200,
    maxWidth: 260,
  },
  descText: {
    fontSize: 12,
    color: "#1a1a18",
    display: "block",
  },
  txnId: {
    fontSize: 11,
    color: "#6b6b68",
    fontFamily: "monospace",
    whiteSpace: "nowrap",
  },
  dateMain: {
    fontSize: 12,
    color: "#1a1a18",
    whiteSpace: "nowrap",
  },
  dateSub: {
    fontSize: 11,
    color: "#9e9d99",
    marginTop: 1,
    whiteSpace: "nowrap",
  },
  shipLink: {
    color: "#185FA5",
    fontSize: 11,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  dash: {
    color: "#9e9d99",
  },
  metaText: {
    fontSize: 11,
    color: "#6b6b68",
    whiteSpace: "nowrap",
  },
  emptyWrap: {
    border: "0.5px solid #e0dfd9",
    borderRadius: 12,
    background: "#ffffff",
    padding: "3rem",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyIcon:  { fontSize: 28, marginBottom: 8 },
  emptyText:  { fontSize: 14, color: "#6b6b68", fontWeight: 500 },
  emptyHint:  { fontSize: 12, color: "#9e9d99", marginTop: 4 },
};