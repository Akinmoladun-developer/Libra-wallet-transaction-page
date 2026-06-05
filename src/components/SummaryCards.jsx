import React, { useMemo } from "react";
import { formatNGN } from "../utils/formatters";

export default function SummaryCards({ transactions }) {
  const summary = useMemo(() => {
    const funded   = transactions.filter(t => t.type === "funding")
                       .reduce((s, t) => s + t.amount, 0);
    const debited  = transactions.filter(t => t.type === "debit")
                       .reduce((s, t) => s + t.amount, 0);
    const refunds  = transactions.filter(t => t.type === "refund" || t.type === "reversal")
                       .reduce((s, t) => s + t.amount, 0);
    const total    = transactions.length;
    const pending  = transactions.filter(t => t.status === "pending").length;
    const failed   = transactions.filter(t => t.status === "failed").length;
    return { funded, debited, refunds, total, pending, failed };
  }, [transactions]);

  const cards = [
    {
      icon: "↓",
      label: "Total funded",
      value: formatNGN(summary.funded),
      hint: `${transactions.filter(t => t.type === "funding").length} deposits`,
      valueColor: "#0F6E56",
      iconColor: "#0F6E56",
    },
    {
      icon: "↑",
      label: "Total debited",
      value: formatNGN(summary.debited),
      hint: `${transactions.filter(t => t.type === "debit").length} shipments`,
      valueColor: "#993C1D",
      iconColor: "#993C1D",
    },
    {
      icon: "↺",
      label: "Refunds & reversals",
      value: formatNGN(summary.refunds),
      hint: `${transactions.filter(t => t.type === "refund" || t.type === "reversal").length} transactions`,
      valueColor: "#185FA5",
      iconColor: "#185FA5",
    },
    {
      icon: "✓",
      label: "Total transactions",
      value: summary.total,
      hint: `${summary.pending} pending · ${summary.failed} failed`,
      valueColor: "#1a1a18",
      iconColor: "#1a1a18",
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((card) => (
        <div key={card.label} style={styles.card}>
          <div style={{ ...styles.icon, color: card.iconColor }}>{card.icon}</div>
          <div style={styles.label}>{card.label}</div>
          <div style={{ ...styles.value, color: card.valueColor }}>{card.value}</div>
          <div style={styles.hint}>{card.hint}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 10,
    marginBottom: 4,
  },
  card: {
    background: "#f6f5f2",
    borderRadius: 8,
    padding: "12px 14px",
  },
  icon: {
    fontSize: 18,
    marginBottom: 5,
  },
  label: {
    fontSize: 11,
    color: "#6b6b68",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  value: {
    fontSize: 20,
    fontWeight: 600,
    marginTop: 4,
  },
  hint: {
    fontSize: 11,
    color: "#9e9d99",
    marginTop: 3,
  },
};