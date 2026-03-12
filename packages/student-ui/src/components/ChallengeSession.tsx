import { useState } from "react";
import { Challenge, SessionResponse } from "../types";
import { startSession } from "../services/api";
import BrowserView from "./BrowserView";
import ExplanationPanel from "./ExplanationPanel";
import { Lang, t } from "../i18n";

interface Props {
  challenge: Challenge;
  sessionData: SessionResponse | null;
  onSessionData: (data: SessionResponse | null) => void;
  lang: Lang;
}

export default function ChallengeSession({ challenge, sessionData, onSessionData, lang }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<"demo" | "practice">("demo");

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    setCurrentStep(0);

    try {
      const data = await startSession(challenge.id, mode, lang);
      onSessionData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onSessionData(null);
    setCurrentStep(0);
  };

  const steps = sessionData?.steps || [];

  return (
    <div>
      {/* Challenge Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ color: "#38bdf8", marginBottom: "0.5rem" }}>{challenge.title}</h2>
        <p style={{ color: "#94a3b8" }}>{challenge.description}</p>
      </div>

      {/* Controls */}
      {!sessionData && (
        <div
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>{t("chooseMode", lang)}</h3>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <button
              onClick={() => setMode("demo")}
              style={{
                flex: 1,
                padding: "1rem",
                background: mode === "demo" ? "#1d4ed8" : "#334155",
                color: "white",
                border: mode === "demo" ? "2px solid #3b82f6" : "2px solid transparent",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <strong style={{ display: "block", marginBottom: "0.25rem" }}>{t("watchDemo", lang)}</strong>
              <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                {t("watchDemoDesc", lang)}
              </span>
            </button>
            <button
              onClick={() => setMode("practice")}
              style={{
                flex: 1,
                padding: "1rem",
                background: mode === "practice" ? "#1d4ed8" : "#334155",
                color: "white",
                border: mode === "practice" ? "2px solid #3b82f6" : "2px solid transparent",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <strong style={{ display: "block", marginBottom: "0.25rem" }}>{t("practiceMode", lang)}</strong>
              <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                {t("practiceModeDesc", lang)}
              </span>
            </button>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            style={{
              background: loading ? "#475569" : "#2563eb",
              color: "white",
              border: "none",
              padding: "0.75rem 2rem",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {loading ? t("startingSession", lang) : t("start", lang)}
          </button>

          {error && (
            <p style={{ color: "#ef4444", marginTop: "1rem" }}>{t("error", lang)}: {error}</p>
          )}
        </div>
      )}

      {/* Session View */}
      {sessionData && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ color: "#64748b" }}>
              {t("modeLabel", lang)}: {sessionData.session.mode === "demo" ? t("aiDemo", lang) : t("practice", lang)}
              {" | "}{t("followSteps", lang)}
            </span>
            <button
              onClick={handleClose}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "0.4rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {t("endSession", lang)}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "1rem", minHeight: "600px" }}>
            <BrowserView targetPath={challenge.targetPath} lang={lang} />
            <ExplanationPanel
              steps={steps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              challengeId={challenge.id}
              mode={sessionData.session.mode as "demo" | "practice"}
              lang={lang}
            />
          </div>
        </div>
      )}
    </div>
  );
}
