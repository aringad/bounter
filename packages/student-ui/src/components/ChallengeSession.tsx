import { useState } from "react";
import { Challenge, SessionResponse, StepResult } from "../types";
import { startSession, closeSession } from "../services/api";
import BrowserView from "./BrowserView";
import ExplanationPanel from "./ExplanationPanel";

interface Props {
  challenge: Challenge;
  sessionData: SessionResponse | null;
  onSessionData: (data: SessionResponse | null) => void;
}

export default function ChallengeSession({ challenge, sessionData, onSessionData }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<"demo" | "practice">("demo");

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    setCurrentStep(0);

    try {
      const data = await startSession(challenge.id, mode);
      onSessionData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (sessionData?.session?.id) {
      await closeSession(sessionData.session.id).catch(() => {});
    }
    onSessionData(null);
    setCurrentStep(0);
  };

  const steps = sessionData?.steps || [];
  const currentScreenshot = steps[currentStep]?.screenshot;

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
          <h3 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>Choose Mode</h3>
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
              <strong style={{ display: "block", marginBottom: "0.25rem" }}>Watch AI Demo</strong>
              <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                The AI demonstrates the exploit step-by-step with explanations
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
              <strong style={{ display: "block", marginBottom: "0.25rem" }}>Practice Mode</strong>
              <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                Try to exploit the vulnerability yourself with AI hints
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
            {loading ? "Starting session..." : "Start"}
          </button>

          {error && (
            <p style={{ color: "#ef4444", marginTop: "1rem" }}>Error: {error}</p>
          )}
        </div>
      )}

      {/* Session View */}
      {sessionData && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ color: "#64748b" }}>
              Session: {sessionData.session.id.slice(0, 8)}... | Mode: {sessionData.session.mode}
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
              End Session
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "1rem", minHeight: "500px" }}>
            {/* Browser View */}
            <BrowserView
              screenshot={currentScreenshot}
              pageUrl={steps[currentStep]?.pageUrl}
              pageTitle={steps[currentStep]?.pageTitle}
            />

            {/* Explanation Panel */}
            <ExplanationPanel
              steps={steps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              sessionId={sessionData.session.id}
              mode={sessionData.session.mode as "demo" | "practice"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
