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
  const [quizStarted, setQuizStarted] = useState(false);

  const isGeneral = challenge.type === "general";

  const handleStart = async () => {
    if (isGeneral) {
      setQuizStarted(true);
      return;
    }
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
    if (isGeneral) {
      setQuizStarted(false);
      return;
    }
    onSessionData(null);
    setCurrentStep(0);
  };

  const steps = sessionData?.steps || [];
  const descKey = `desc.${challenge.id}` as any;
  const localDesc = t(descKey, lang);

  // General quiz: full-width iframe, no side panel
  if (isGeneral) {
    return (
      <div>
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#2ea3f2", marginBottom: "0.5rem" }}>{challenge.title}</h2>
          <p style={{ color: "#94a3b8" }}>{localDesc !== descKey ? localDesc : challenge.description}</p>
        </div>

        {!quizStarted ? (
          <div
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#e2e8f0", marginBottom: "1rem", fontSize: "0.95rem" }}>
              {lang === "it"
                ? "Quiz interattivo con feedback immediato. Nessuna IA richiesta."
                : "Interactive quiz with immediate feedback. No AI required."}
            </p>
            <button
              onClick={handleStart}
              style={{
                background: "#2ea3f2",
                color: "white",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {t("startQuiz", lang)}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ color: "#64748b" }}>
                {t("quiz", lang)}
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
                {t("closeQuiz", lang)}
              </button>
            </div>
            <div style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              overflow: "hidden",
              minHeight: "700px",
            }}>
              <iframe
                src={challenge.targetPath}
                style={{
                  width: "100%",
                  height: "700px",
                  border: "none",
                  background: "#0f172a",
                }}
                title={challenge.title}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Technical challenge: existing AI-powered flow
  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ color: "#38bdf8", marginBottom: "0.5rem" }}>{challenge.title}</h2>
        <p style={{ color: "#94a3b8" }}>{localDesc !== descKey ? localDesc : challenge.description}</p>
      </div>

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
