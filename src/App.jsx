import React, { useState, useMemo, useRef, useEffect } from "react";
import { MERCHANT, TRANSACTIONS } from "./data/transactions";
import MerchantCard      from "./components/MerchantCard";
import SummaryCards      from "./components/SummaryCards";
import FilterBar         from "./components/FilterBar";
import TransactionTable  from "./components/TransactionTable";
import DetailPanel       from "./components/DetailPanel";
import Pagination        from "./components/Pagination";
import "./App.css";

const INITIAL_FILTERS = {
  fromDay: "", fromMonth: "", fromYear: "",
  toDay:   "", toMonth:   "", toYear:   "",
  type:        "",
  status:      "",
  initiatedBy: "",
  search:      "",
};

// Statement / Print HTML builder
function buildStatementHTML(merchant, transactions) {
  const rows = transactions.map((t) => `
    <tr>
      <td>${t.id}</td>
      <td>${t.date} ${t.time}</td>
      <td>${t.type}</td>
      <td>${t.desc}</td>
      <td style="text-align:right;color:${t.dir === "cr" ? "#0F6E56" : "#993C1D"}">
        ${t.dir === "cr" ? "+" : "−"}₦${Math.abs(t.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
      </td>
      <td style="text-align:right">
        ${t.balBefore < 0 ? "−" : ""}₦${Math.abs(t.balBefore).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
      </td>
      <td style="text-align:right">
        ${t.balAfter < 0 ? "−" : ""}₦${Math.abs(t.balAfter).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
      </td>
      <td>${t.status}</td>
      <td>${t.shipment || "—"}</td>
      <td>${t.method}</td>
      <td>${t.initiatedBy}</td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wallet Statement — ${merchant.name}</title>
      <style>
        body  { font-family: Arial, sans-serif; padding: 32px; color: #1a1a18; font-size: 13px; }
        h1    { font-size: 20px; margin-bottom: 4px; }
        p     { color: #6b6b68; margin: 2px 0; font-size: 12px; }
        .meta { display:flex; gap:32px; margin:20px 0 28px; padding:16px;
                background:#f6f5f2; border-radius:8px; }
        .meta div   { display:flex; flex-direction:column; gap:3px; }
        .meta label { font-size:10px; text-transform:uppercase;
                      letter-spacing:.06em; color:#9e9d99; }
        .meta span  { font-size:14px; font-weight:600; }
        table { width:100%; border-collapse:collapse; font-size:11px; }
        th    { background:#f6f5f2; padding:8px 10px; text-align:left;
                font-size:10px; text-transform:uppercase; letter-spacing:.05em;
                color:#6b6b68; border-bottom:1px solid #e0dfd9; }
        td    { padding:9px 10px; border-bottom:1px solid #f0efe9;
                vertical-align:middle; }
        tr:hover td { background:#fafaf8; }
        .footer { margin-top:32px; font-size:11px; color:#9e9d99; text-align:center; }
      </style>
    </head>
    <body>
      <h1>Wallet Statement</h1>
      <p>Libra Logistics · Generated on ${new Date().toLocaleDateString("en-NG", { dateStyle: "long" })}</p>
      <div class="meta">
        <div><label>Merchant</label><span>${merchant.name}</span></div>
        <div><label>Merchant ID</label><span>${merchant.id}</span></div>
        <div>
          <label>Current balance</label>
          <span>₦${merchant.balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
        </div>
        <div><label>Transactions shown</label><span>${transactions.length}</span></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>TXN ID</th><th>Date & Time</th><th>Type</th><th>Description</th>
            <th style="text-align:right">Amount</th>
            <th style="text-align:right">Bal. Before</th>
            <th style="text-align:right">Bal. After</th>
            <th>Status</th><th>Shipment</th><th>Method</th><th>By</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">
        Libra Logistics · Wallet Statement · ${merchant.name} (${merchant.id})
      </div>
    </body>
    </html>
  `;
}

// This is for the Fund Wallet Modal...
function FundWalletModal({ merchant, onClose, onConfirm }) {
  const [amount,    setAmount]    = useState("");
  const [method,    setMethod]    = useState("bank_transfer");
  const [ref,       setRef]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const fundedAmount = Number(amount);
  const newBalance   = merchant.balance + (isNaN(fundedAmount) ? 0 : fundedAmount);

  const handleSubmit = () => {
    if (!amount || isNaN(fundedAmount) || fundedAmount <= 0) {
      setError("Please enter a valid amount greater than ₦0.");
      return;
    }
    setError("");

    // This Builds the new transaction entry 
    const now     = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const txnId   = `TXN-${Date.now().toString().slice(-5)}`;

    const newTxn = {
      id:          txnId,
      date:        dateStr,
      time:        timeStr,
      type:        "funding",
      desc:        `Wallet top-up via ${method.replace("_", " ")}`,
      amount:      fundedAmount,
      dir:         "cr",
      balBefore:   merchant.balance,
      balAfter:    newBalance,
      status:      "success",
      shipment:    null,
      method:      method.replace("_", " "),
      ref:         ref || "—",
      initiatedBy: "Merchant",
    };

    // Lift both the new balance 
    onConfirm(newBalance, newTxn);
    setSubmitted(true);
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.box} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={modalStyles.header}>
          <div style={modalStyles.headerTitle}>Fund wallet</div>
          <button style={modalStyles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {!submitted ? (
          <>
            {/* Merchant info row */}
            <div style={modalStyles.merchantRow}>
              <div style={modalStyles.avatar}>AS</div>
              <div>
                <div style={modalStyles.merchantName}>{merchant.name}</div>
                <div style={modalStyles.merchantId}>{merchant.id}</div>
              </div>
              <div style={modalStyles.currentBal}>
                <div style={modalStyles.balLabel}>Current balance</div>
                <div style={modalStyles.balVal}>
                  ₦{merchant.balance.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            <div style={modalStyles.divider} />

            {/* Amount */}
            <div style={modalStyles.fieldGroup}>
              <label style={modalStyles.label}>Amount (₦) *</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 50000"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                style={{
                  ...modalStyles.input,
                  borderColor: error ? "#E24B4A" : "#c8c7c0",
                }}
              />
              {error && (
                <div style={modalStyles.errorText}>{error}</div>
              )}
            </div>

            {/* Payment method */}
            <div style={modalStyles.fieldGroup}>
              <label style={modalStyles.label}>Payment method *</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                style={modalStyles.input}
              >
                <option value="bank_transfer">Bank transfer</option>
                <option value="card">Card payment</option>
                <option value="ussd">USSD</option>
                <option value="cash">Cash deposit</option>
              </select>
            </div>

            {/* Reference */}
            <div style={modalStyles.fieldGroup}>
              <label style={modalStyles.label}>
                Payment reference <span style={{ fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. NIP/2605/1144"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                style={modalStyles.input}
              />
            </div>

            {/* Live balance preview */}
            {amount && !isNaN(fundedAmount) && fundedAmount > 0 && (
              <div style={modalStyles.preview}>
                <div style={modalStyles.previewRow}>
                  <span style={modalStyles.previewLabel}>Current balance</span>
                  <span style={modalStyles.previewCurrent}>
                    ₦{merchant.balance.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div style={modalStyles.previewRow}>
                  <span style={modalStyles.previewLabel}>Amount to add</span>
                  <span style={{ fontSize: 13, color: "#0F6E56", fontWeight: 500 }}>
                    +₦{fundedAmount.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div style={modalStyles.divider} />
                <div style={modalStyles.previewRow}>
                  <span style={modalStyles.previewLabelBold}>
                    New wallet balance
                  </span>
                  <span style={modalStyles.previewVal}>
                    ₦{newBalance.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={modalStyles.actions}>
              <button style={modalStyles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button style={modalStyles.submitBtn} onClick={handleSubmit}>
                Confirm funding
              </button>
            </div>
          </>
        ) : (
          // For Success screen...
          <div style={modalStyles.successWrap}>
            <div style={modalStyles.successIcon}>✅</div>
            <div style={modalStyles.successTitle}>Wallet funded successfully!</div>
            <div style={modalStyles.successSub}>
              <strong>
                ₦{fundedAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </strong>{" "}
              has been credited to <strong>{merchant.name}</strong> via{" "}
              {method.replace("_", " ")}.
            </div>

            {/* New balance highlight */}
            <div style={modalStyles.successBalBox}>
              <div style={modalStyles.balLabel}>New wallet balance</div>
              <div style={modalStyles.successNewBal}>
                ₦{newBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </div>
            </div>

            <button style={modalStyles.submitBtn} onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App...
export default function App() {
  const [filters, setFilters]           = useState(INITIAL_FILTERS);
  const [perPage, setPerPage]           = useState(10);
  const [page, setPage]                 = useState(1);
  const [selectedTxn, setSelectedTxn]   = useState(null);
  const [showFundModal, setShowFundModal] = useState(false);

  // ── KEY FIX: lift merchant balance and transactions into state ──
  const [merchantData, setMerchantData]     = useState({ ...MERCHANT });
  const [transactions,  setTransactions]    = useState([...TRANSACTIONS]);

  const detailRef = useRef(null);

  // Auto-scroll to detail panel when a row is selected
  useEffect(() => {
    if (selectedTxn && detailRef.current) {
      setTimeout(() => {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    }
  }, [selectedTxn]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPerPage(10);
    setPage(1);
    setSelectedTxn(null);
  };

  // ── KEY FIX: update balance + prepend new transaction
  const handleFundConfirm = (newBalance, newTxn) => {
    setMerchantData((prev) => ({ ...prev, balance: newBalance }));
    setTransactions((prev) => [newTxn, ...prev]);
  };

  // Filtering...
  const filtered = useMemo(() => {
    return transactions.filter((txn) => {
      const txnDate = new Date(txn.date);

      if (filters.fromYear || filters.fromMonth || filters.fromDay) {
        const from = new Date(
          filters.fromYear  || 2010,
          filters.fromMonth ? filters.fromMonth - 1 : 0,
          filters.fromDay   || 1
        );
        if (txnDate < from) return false;
      }

      if (filters.toYear || filters.toMonth || filters.toDay) {
        const to = new Date(
          filters.toYear  || 2026,
          filters.toMonth ? filters.toMonth - 1 : 11,
          filters.toDay   || 31
        );
        if (txnDate > to) return false;
      }

      if (filters.type        && txn.type        !== filters.type)        return false;
      if (filters.status      && txn.status      !== filters.status)      return false;
      if (filters.initiatedBy && txn.initiatedBy !== filters.initiatedBy) return false;

      if (filters.search) {
        const q    = filters.search.toLowerCase();
        const blob = [
          txn.id,
          txn.desc,
          txn.shipment || "",
          txn.ref,
          txn.method,
        ].join(" ").toLowerCase();
        if (!blob.includes(q)) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  // This is for Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice(
    (safePage - 1) * perPage,
    safePage * perPage
  );

  const handleRowClick = (txn) => {
    setSelectedTxn((prev) => (prev?.id === txn.id ? null : txn));
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "TXN ID","Date","Time","Type","Description","Amount",
      "Direction","Balance Before","Balance After","Status",
      "Shipment ID","Payment Method","Reference","Initiated By",
    ];
    const rows = filtered.map((t) => [
      t.id, t.date, t.time, t.type, `"${t.desc}"`,
      t.amount, t.dir === "cr" ? "Credit" : "Debit",
      t.balBefore, t.balAfter, t.status,
      t.shipment || "", t.method, t.ref, t.initiatedBy,
    ]);
    const csv  = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `libra_transactions_${merchantData.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print...
  const handlePrint = () => {
    const html = buildStatementHTML(merchantData, filtered);
    const win  = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  // Statement...
  const handleStatement = () => {
    const html = buildStatementHTML(merchantData, filtered);
    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div style={styles.page}>

      {/* ── Page header ── */}
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.pageTitle}>Wallet Transaction History</h2>
          <p style={styles.pageSub}>Libra Logistics · Admin panel</p>
        </div>
        <div style={styles.topActions}>
          <button style={styles.headerBtn} onClick={handleStatement}>
            📄 Statement
          </button>
          <button style={styles.headerBtn} onClick={handleExportCSV}>
            ⬇ Export CSV
          </button>
          <button style={styles.headerBtn} onClick={handlePrint}>
            🖨 Print
          </button>
          <button
            style={styles.headerBtnPrimary}
            onClick={() => setShowFundModal(true)}
          >
            + Fund wallet
          </button>
        </div>
      </div>

      {/* ── Merchant card — now receives live merchantData ── */}
      <MerchantCard merchant={merchantData} />

      {/* ── Summary cards ── */}
      <div style={styles.sectionLabel}>Period summary</div>
      <SummaryCards transactions={filtered} />

      {/* ── Filter bar ── */}
      <div style={styles.sectionLabel}>Filters &amp; search</div>
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        perPage={perPage}
        onPerPageChange={(val) => { setPerPage(val); setPage(1); }}
      />

      {/* ── Transaction table ── */}
      <div style={styles.sectionLabel}>
        Transactions
        <span style={styles.resultCount}>
          ({filtered.length} result{filtered.length !== 1 ? "s" : ""})
        </span>
      </div>

      <TransactionTable
        transactions={pageData}
        onRowClick={handleRowClick}
        selectedId={selectedTxn?.id}
      />

      {/* ── Pagination ── */}
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalResults={filtered.length}
        perPage={perPage}
        onPageChange={(p) => { setPage(p); setSelectedTxn(null); }}
      />

      {/* ── Detail panel ── */}
      {selectedTxn && (
        <div ref={detailRef}>
          <DetailPanel
            txn={selectedTxn}
            onClose={() => setSelectedTxn(null)}
          />
        </div>
      )}

      {/* ── Fund wallet modal ── */}
      {showFundModal && (
        <FundWalletModal
          merchant={merchantData}
          onConfirm={handleFundConfirm}
          onClose={() => setShowFundModal(false)}
        />
      )}

    </div>
  );
}

// Page styles...
const styles = {
  page: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "#f6f5f2",
    minHeight: "100vh",
  },
  topBar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: "#1a1a18",
    margin: 0,
  },
  pageSub: {
    fontSize: 12,
    color: "#6b6b68",
    marginTop: 3,
  },
  topActions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  headerBtn: {
    fontSize: 12,
    padding: "7px 14px",
    borderRadius: 8,
    border: "0.5px solid #c8c7c0",
    background: "#ffffff",
    color: "#1a1a18",
    cursor: "pointer",
    fontWeight: 400,
  },
  headerBtnPrimary: {
    fontSize: 12,
    padding: "7px 14px",
    borderRadius: 8,
    border: "none",
    background: "#185FA5",
    color: "#E6F1FB",
    cursor: "pointer",
    fontWeight: 500,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: "#6b6b68",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    margin: "16px 0 8px",
  },
  resultCount: {
    fontWeight: 400,
    marginLeft: 6,
    textTransform: "none",
    letterSpacing: 0,
    color: "#9e9d99",
  },
};

// Modal styles...
const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  box: {
    background: "#ffffff",
    borderRadius: 14,
    padding: "24px 28px",
    width: "100%",
    maxWidth: 480,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a18",
  },
  closeBtn: {
    fontSize: 14,
    color: "#6b6b68",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "2px 6px",
  },
  merchantRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#E6F1FB",
    color: "#0C447C",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "0.5px solid #B5D4F4",
    flexShrink: 0,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1a1a18",
  },
  merchantId: {
    fontSize: 11,
    color: "#6b6b68",
    fontFamily: "monospace",
    marginTop: 2,
  },
  currentBal: {
    marginLeft: "auto",
    textAlign: "right",
  },
  balLabel: {
    fontSize: 10,
    color: "#9e9d99",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  balVal: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1a18",
    marginTop: 2,
  },
  divider: {
    height: "0.5px",
    background: "#e0dfd9",
    margin: "12px 0",
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 11,
    color: "#6b6b68",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 6,
    fontWeight: 500,
  },
  input: {
    width: "100%",
    height: 36,
    padding: "0 10px",
    fontSize: 13,
    borderRadius: 8,
    border: "0.5px solid #c8c7c0",
    background: "#ffffff",
    color: "#1a1a18",
    outline: "none",
  },
  errorText: {
    fontSize: 11,
    color: "#E24B4A",
    marginTop: 5,
  },
  preview: {
    background: "#f6f5f2",
    border: "0.5px solid #e0dfd9",
    borderRadius: 8,
    padding: "12px 14px",
    marginBottom: 18,
  },
  previewRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  previewLabel: {
    fontSize: 12,
    color: "#6b6b68",
  },
  previewLabelBold: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1a1a18",
  },
  previewCurrent: {
    fontSize: 13,
    color: "#1a1a18",
    fontWeight: 500,
  },
  previewVal: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0F6E56",
  },
  actions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 4,
  },
  cancelBtn: {
    fontSize: 13,
    padding: "8px 18px",
    borderRadius: 8,
    border: "0.5px solid #c8c7c0",
    background: "transparent",
    color: "#6b6b68",
    cursor: "pointer",
  },
  submitBtn: {
    fontSize: 13,
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    background: "#185FA5",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 500,
  },
  successWrap: {
    textAlign: "center",
    padding: "12px 0 8px",
  },
  successIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#1a1a18",
    marginBottom: 8,
  },
  successSub: {
    fontSize: 13,
    color: "#6b6b68",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  successBalBox: {
    background: "#EAF3DE",
    border: "0.5px solid #C0DD97",
    borderRadius: 10,
    padding: "14px 20px",
    marginBottom: 24,
    display: "inline-block",
    width: "100%",
  },
  successNewBal: {
    fontSize: 26,
    fontWeight: 700,
    color: "#0F6E56",
    marginTop: 4,
  },
};