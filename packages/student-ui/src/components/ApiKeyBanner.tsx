import { useEffect, useState } from "react";

interface Props {
  show: boolean;
}

export default function ApiKeyBanner({ show }: Props) {
  const [status, setStatus] = useState<{ hasKey: boolean; masked: string } | null>(null);

  useEffect(() => {
    fetch("/api/apikey")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/api/login";
          return null;
        }
        return r.json();
      })
      .then((data) => data && setStatus(data))
      .catch(() => {});
  }, []);

  if (!show) {
    if (status && !status.hasKey) {
      return (
        <div
          style={{
            background: "rgba(224,153,0,0.15)",
            borderBottom: "1px solid rgba(224,153,0,0.3)",
            padding: "0.5rem 2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.85rem",
          }}
        >
          <span style={{ color: "#e09900", fontWeight: 600 }}>Attenzione:</span>
          <span style={{ color: "#e2e8f0" }}>
            Nessuna API key Gemini configurata. Contattare l'amministratore.
          </span>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.3)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "1.25rem 2rem",
      }}
    >
      <div style={{ maxWidth: "600px" }}>
        <h3 style={{ color: "#e09900", marginBottom: "0.5rem", fontSize: "1rem" }}>
          Impostazioni
        </h3>

        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ color: "#94a3b8", fontSize: "0.85rem", display: "block", marginBottom: "0.35rem" }}>
            Google Gemini API Key
          </label>

          {status?.hasKey ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 0.6rem",
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "6px",
                fontSize: "0.85rem",
              }}
            >
              <span style={{ color: "#22c55e" }}>Attiva:</span>
              <code style={{ color: "#e2e8f0", background: "rgba(255,255,255,0.1)", padding: "0.1rem 0.3rem", borderRadius: "3px" }}>
                {status.masked}
              </code>
            </div>
          ) : (
            <div
              style={{
                padding: "0.4rem 0.6rem",
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "6px",
                fontSize: "0.85rem",
                color: "#fca5a5",
              }}
            >
              Non configurata. La key va impostata come variabile d'ambiente <code style={{ background: "rgba(255,255,255,0.1)", padding: "0.1rem 0.3rem", borderRadius: "3px" }}>GEMINI_API_KEY</code> su Vercel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
