import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  totalResults,
  perPage,
  onPageChange,
}) {
  const startItem = totalResults === 0
    ? 0
    : (currentPage - 1) * perPage + 1;

  const endItem = Math.min(currentPage * perPage, totalResults);

  // Build page number array with ellipsis
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end   = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div style={styles.wrap}>

      {/* ── Left: results info ── */}
      <div style={styles.info}>
        {totalResults === 0 ? (
          <span>No transactions found</span>
        ) : (
          <span>
            Showing{" "}
            <strong style={styles.strong}>{startItem}</strong>
            {" "}–{" "}
            <strong style={styles.strong}>{endItem}</strong>
            {" "}of{" "}
            <strong style={styles.strong}>{totalResults}</strong>
            {" "}transaction{totalResults !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Right: page buttons ── */}
      {totalPages > 1 && (
        <div style={styles.btnGroup}>

          {/* Previous button */}
          <button
            style={{
              ...styles.btn,
              ...(currentPage === 1 ? styles.btnDisabled : {}),
            }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ← Prev
          </button>

          {/* Page number buttons */}
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} style={styles.ellipsis}>
                …
              </span>
            ) : (
              <button
                key={page}
                style={{
                  ...styles.btn,
                  ...(currentPage === page ? styles.btnActive : {}),
                }}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}

          {/* Next button */}
          <button
            style={{
              ...styles.btn,
              ...(currentPage === totalPages ? styles.btnDisabled : {}),
            }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next →
          </button>

        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    padding: "12px 0",
    marginBottom: 8,
  },
  info: {
    fontSize: 12,
    color: "#6b6b68",
  },
  strong: {
    fontWeight: 600,
    color: "#1a1a18",
  },
  btnGroup: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  btn: {
    fontSize: 12,
    padding: "5px 11px",
    borderRadius: 8,
    border: "0.5px solid #c8c7c0",
    background: "#ffffff",
    color: "#1a1a18",
    cursor: "pointer",
    fontWeight: 400,
    transition: "background 0.1s ease",
    minWidth: 36,
    textAlign: "center",
  },
  btnActive: {
    background: "#185FA5",
    color: "#E6F1FB",
    border: "0.5px solid #185FA5",
    fontWeight: 600,
  },
  btnDisabled: {
    opacity: 0.38,
    cursor: "not-allowed",
  },
  ellipsis: {
    fontSize: 13,
    color: "#9e9d99",
    padding: "0 4px",
  },
};