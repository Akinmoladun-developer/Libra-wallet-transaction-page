import React from "react";
import { formatNGN } from "../utils/formatters";

export default function MerchantCard({ merchant }) {
  return (
    <div style={styles.card}>
      {/* Left — identity */}
      <div style={styles.left}>
        <div style={styles.avatar}>{merchant.initials}</div>
        <div>
          <div style={styles.nameRow}>
            <span style={styles.name}>{merchant.name}</span>
            <span style={styles.activeBadge}>{merchant.status}</span>
          </div>

          <div style={styles.metaRow}>
            <span style={styles.metaItem}>🪪 {merchant.id}</span>
            <span style={styles.metaItem}>📞 {merchant.phone}</span>
            <span style={styles.metaItem}>✉ {merchant.email}</span>
            <span style={styles.metaItem}>📍 {merchant.location}</span>
          </div>

          <div style={styles.tagRow}>
            <span style={styles.tag}>Joined: {merchant.joined}</span>
            <span style={styles.tag}>Tier: {merchant.tier}</span>
            <span style={styles.tag}>Category: {merchant.category}</span>
          </div>
        </div>
      </div>

      {/* Right — balance */}
      <div style={styles.right}>
        <div style={styles.balLabel}>Current wallet balance</div>
        <div style={styles.balAmount}>{formatNGN(merchant.balance)}</div>
        <div style={styles.balSub}>Last funded: {merchant.lastFunded}</div>
        <div style={styles.balTrend}>
          ↑ +{formatNGN(merchant.weeklyChange)} this week
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    border: "0.5px solid #e0dfd9",
    borderRadius: 12,
    padding: "16px 20px",
    marginBottom: 12,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: "#E6F1FB",
    color: "#0C447C",
    fontSize: 15,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "0.5px solid #B5D4F4",
    flexShrink: 0,
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a18",
  },
  activeBadge: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 99,
    background: "#EAF3DE",
    color: "#27500A",
    border: "0.5px solid #C0DD97",
    fontWeight: 500,
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 6,
  },
  metaItem: {
    fontSize: 12,
    color: "#6b6b68",
    display: "flex",
    alignItems: "center",
    gap: 3,
  },
  tagRow: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  tag: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 99,
    background: "#E6F1FB",
    color: "#0C447C",
    border: "0.5px solid #B5D4F4",
  },
  right: {
    textAlign: "right",
    flexShrink: 0,
  },
  balLabel: {
    fontSize: 11,
    color: "#6b6b68",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  balAmount: {
    fontSize: 26,
    fontWeight: 700,
    color: "#1a1a18",
    marginTop: 2,
  },
  balSub: {
    fontSize: 11,
    color: "#6b6b68",
    marginTop: 2,
  },
  balTrend: {
    display: "inline-block",
    marginTop: 5,
    fontSize: 11,
    color: "#27500A",
    background: "#EAF3DE",
    padding: "2px 8px",
    borderRadius: 99,
    border: "0.5px solid #C0DD97",
  },
};