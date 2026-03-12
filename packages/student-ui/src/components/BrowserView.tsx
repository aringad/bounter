interface Props {
  screenshot?: string;
  pageUrl?: string;
  pageTitle?: string;
}

export default function BrowserView({ screenshot, pageUrl, pageTitle }: Props) {
  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Browser Chrome */}
      <div
        style={{
          background: "#0f172a",
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderBottom: "1px solid #334155",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
        </div>
        <div
          style={{
            flex: 1,
            background: "#1e293b",
            padding: "0.3rem 0.75rem",
            borderRadius: "4px",
            fontSize: "0.8rem",
            color: "#94a3b8",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {pageUrl || "about:blank"}
        </div>
      </div>

      {/* Screenshot */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        {screenshot ? (
          <img
            src={`data:image/jpeg;base64,${screenshot}`}
            alt={pageTitle || "Browser view"}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <div style={{ color: "#64748b", textAlign: "center", padding: "2rem" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No screenshot available</p>
            <p style={{ fontSize: "0.9rem" }}>Start a session to see the browser view</p>
          </div>
        )}
      </div>
    </div>
  );
}
