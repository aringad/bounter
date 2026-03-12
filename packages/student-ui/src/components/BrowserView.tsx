interface Props {
  targetPath?: string;
}

export default function BrowserView({ targetPath }: Props) {
  const url = targetPath || "about:blank";

  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
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
          {url}
        </div>
      </div>

      {/* Iframe */}
      <div style={{ flex: 1, minHeight: "500px" }}>
        {targetPath ? (
          <iframe
            src={url}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "#0f172a",
            }}
            title="Vulnerable App"
          />
        ) : (
          <div style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Select a challenge to begin</p>
            <p style={{ fontSize: "0.9rem" }}>The vulnerable app will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
