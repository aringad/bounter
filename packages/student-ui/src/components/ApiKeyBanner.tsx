import { useEffect, useState } from "react";

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function ApiKeyBanner({ show, onClose }: Props) {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<{ hasKey: boolean; masked: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/apikey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: apiKey.trim() }),
      });
      if (res.ok) {
        setMessage("API key salvata!");
        setApiKey("");
        // Refresh status
        const s = await fetch("/api/apikey").then((r) => r.json());
        setStatus(s);
      } else {
        setMessage("Errore nel salvataggio.");
      }
    } catch {
      setMessage("Errore di rete.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    await fetch("/api/apikey", { method: "DELETE" });
    setStatus({ hasKey: false, masked: "" });
    setMessage("API key rimossa.");
  };

  if (!show) {
    // Show a small warning banner if no key is set
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
            Nessuna API key Gemini configurata. Le funzioni AI (demo, hint) non funzioneranno.
          </span>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "#e09900",
              color: "#1c1b3a",
              border: "none",
              padding: "0.25rem 0.6rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
            // This triggers the parent to show settings
            onClickCapture={(e) => {
              e.stopPropagation();
              // We need to open settings, so we call onClose which actually toggles
              onClose();
            }}
          >
            Configura
          </button>
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
          <p style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
            Ottieni una key gratuita su{" "}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: "#2ea3f2" }}>
              aistudio.google.com/apikey
            </a>
          </p>

          {status?.hasKey && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
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
              <button
                onClick={handleRemove}
                style={{
                  marginLeft: "auto",
                  background: "transparent",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.3)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Rimuovi
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={status?.hasKey ? "Sostituisci key..." : "Incolla la tua API key..."}
              style={{
                flex: 1,
                padding: "0.5rem 0.75rem",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "6px",
                color: "#e2e8f0",
                fontSize: "0.9rem",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <button
              onClick={handleSave}
              disabled={saving || !apiKey.trim()}
              style={{
                background: saving || !apiKey.trim() ? "rgba(255,255,255,0.1)" : "#e09900",
                color: saving || !apiKey.trim() ? "#64748b" : "#1c1b3a",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                cursor: saving || !apiKey.trim() ? "not-allowed" : "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              {saving ? "..." : "Salva"}
            </button>
          </div>

          {message && (
            <p style={{ color: message.includes("Errore") ? "#ef4444" : "#22c55e", fontSize: "0.8rem", marginTop: "0.4rem" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
