import React from "react";
import { MONTHS, YEARS } from "../data/transactions";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const SELECT_STYLE = {
  fontSize: 12,
  height: 32,
  padding: "0 8px",
  borderRadius: 8,
  border: "0.5px solid #c8c7c0",
  background: "#ffffff",
  color: "#1a1a18",
  cursor: "pointer",
  outline: "none",
};

const LABEL_STYLE = {
  fontSize: 11,
  color: "#6b6b68",
  whiteSpace: "nowrap",
  alignSelf: "center",
};

const DIVIDER = (
  <div
    style={{
      height: 1,
      background: "#e0dfd9",
      margin: "10px 0",
    }}
  />
);

export default function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  perPage,
  onPerPageChange,
}) {
  const {
    fromDay, fromMonth, fromYear,
    toDay,   toMonth,   toYear,
    type, status, initiatedBy, search,
  } = filters;

  const handle = (key) => (e) => onFilterChange(key, e.target.value);

  const activePills = [
    type        && { label: `Type: ${type}`,             key: "type" },
    status      && { label: `Status: ${status}`,         key: "status" },
    initiatedBy && { label: `By: ${initiatedBy}`,        key: "initiatedBy" },
    search      && { label: `Search: "${search}"`,       key: "search" },
    (fromDay || fromMonth || fromYear) && {
      label: `From: ${fromDay || "?"} ${fromMonth || "?"} ${fromYear || "?"}`,
      key: "from",
    },
    (toDay || toMonth || toYear) && {
      label: `To: ${toDay || "?"} ${toMonth || "?"} ${toYear || "?"}`,
      key: "to",
    },
  ].filter(Boolean);

  return (
    <div style={styles.box}>

      {/* ── Row 1: From date ── */}
      <div style={styles.row}>
        <span style={{ ...LABEL_STYLE, fontWeight: 500 }}>From date</span>

        <span style={LABEL_STYLE}>Day</span>
        <select style={{ ...SELECT_STYLE, width: 68 }} value={fromDay} onChange={handle("fromDay")}>
          <option value="">--</option>
          {DAYS.map(d => (
            <option key={d} value={d}>{String(d).padStart(2, "0")}</option>
          ))}
        </select>

        <span style={LABEL_STYLE}>Month</span>
        <select style={{ ...SELECT_STYLE, width: 120 }} value={fromMonth} onChange={handle("fromMonth")}>
          <option value="">--</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>

        <span style={LABEL_STYLE}>Year</span>
        <select style={{ ...SELECT_STYLE, width: 85 }} value={fromYear} onChange={handle("fromYear")}>
          <option value="">--</option>
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {DIVIDER}

      {/* ── Row 2: To date ── */}
      <div style={styles.row}>
        <span style={{ ...LABEL_STYLE, fontWeight: 500 }}>To date</span>

        <span style={LABEL_STYLE}>Day</span>
        <select style={{ ...SELECT_STYLE, width: 68 }} value={toDay} onChange={handle("toDay")}>
          <option value="">--</option>
          {DAYS.map(d => (
            <option key={d} value={d}>{String(d).padStart(2, "0")}</option>
          ))}
        </select>

        <span style={LABEL_STYLE}>Month</span>
        <select style={{ ...SELECT_STYLE, width: 120 }} value={toMonth} onChange={handle("toMonth")}>
          <option value="">--</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>

        <span style={LABEL_STYLE}>Year</span>
        <select style={{ ...SELECT_STYLE, width: 85 }} value={toYear} onChange={handle("toYear")}>
          <option value="">--</option>
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {DIVIDER}

      {/* ── Row 3: Type / Status / Initiated by ── */}
      <div style={styles.row}>
        <span style={LABEL_STYLE}>Type</span>
        <select style={{ ...SELECT_STYLE, width: 150 }} value={type} onChange={handle("type")}>
          <option value="">All types</option>
          <option value="funding">Wallet funding</option>
          <option value="debit">Shipment debit</option>
          <option value="refund">Refund</option>
          <option value="reversal">Reversal</option>
        </select>

        <span style={LABEL_STYLE}>Status</span>
        <select style={{ ...SELECT_STYLE, width: 140 }} value={status} onChange={handle("status")}>
          <option value="">All statuses</option>
          <option value="success">Successful</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <span style={LABEL_STYLE}>Initiated by</span>
        <select style={{ ...SELECT_STYLE, width: 120 }} value={initiatedBy} onChange={handle("initiatedBy")}>
          <option value="">All</option>
          <option value="Merchant">Merchant</option>
          <option value="Admin">Admin</option>
          <option value="System">System</option>
        </select>

        <div style={{ flex: 1 }} />

        <button style={styles.clearBtn} onClick={onClearFilters}>
          ✕ Clear all
        </button>
      </div>

      {DIVIDER}

      {/* ── Row 4: Search + rows per page ── */}
      <div style={styles.row}>
        <span style={LABEL_STYLE}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={handle("search")}
          placeholder="Search by Transaction Reference ID, shipment ID, description..."
          style={{
            ...SELECT_STYLE,
            width: 380,
            height: 32,
            padding: "0 10px",
          }}
        />

        <div style={{ flex: 1 }} />

        <span style={LABEL_STYLE}>Rows per page</span>
        <select
          style={{ ...SELECT_STYLE, width: 80 }}
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* ── Active filter pills ── */}
      {activePills.length > 0 && (
        <div style={styles.pillsRow}>
          {activePills.map((pill) => (
            <span key={pill.key} style={styles.pill}>
              {pill.label}
              <button
                style={styles.pillX}
                onClick={() => {
                  if (pill.key === "from") {
                    onFilterChange("fromDay", "");
                    onFilterChange("fromMonth", "");
                    onFilterChange("fromYear", "");
                  } else if (pill.key === "to") {
                    onFilterChange("toDay", "");
                    onFilterChange("toMonth", "");
                    onFilterChange("toYear", "");
                  } else {
                    onFilterChange(pill.key, "");
                  }
                }}
                aria-label={`Remove ${pill.label} filter`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  box: {
    background: "#ffffff",
    border: "0.5px solid #e0dfd9",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 12,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  clearBtn: {
    fontSize: 11,
    padding: "5px 12px",
    borderRadius: 8,
    border: "0.5px solid #c8c7c0",
    background: "transparent",
    color: "#6b6b68",
    cursor: "pointer",
  },
  pillsRow: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 10,
    paddingTop: 10,
    borderTop: "0.5px solid #e0dfd9",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    background: "#f6f5f2",
    border: "0.5px solid #c8c7c0",
    borderRadius: 99,
    padding: "2px 9px",
    color: "#6b6b68",
  },
  pillX: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b6b68",
    fontSize: 11,
    padding: 0,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },
};