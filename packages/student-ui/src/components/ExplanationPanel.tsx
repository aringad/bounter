import { useState } from "react";
import { StepResult } from "../types";
import { getHint } from "../services/api";

interface Props {
  steps: StepResult[];
  currentStep: number;
  onStepChange: (step: number) => void;
  challengeId: string;
  mode: "demo" | "practice";
}

const actionLabels: Record<string, string> = {
  navigate: "Navigate",
  click: "Click",
  type: "Type",
  observe: "Observe",
  screenshot: "Screenshot",
};

export default function ExplanationPanel({ steps, currentStep, onStepChange, challengeId, mode }: Props) {
  const [hint, setHint] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);

  const handleGetHint = async () => {
    setLoadingHint(true);
    try {
      const h = await getHint(challengeId, hintMessage || undefined);
      setHint(h);
      setHintMessage("");
    } catch (err: any) {
      setHint("Failed to get hint: " + err.message);
    } finally {
      setLoadingHint(false);
    }
  };

  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "1rem", borderBottom: "1px solid #334155" }}>
        <h3 style={{ color: "#38bdf8", marginBottom: "0.25rem" }}>
          {mode === "demo" ? "AI Walkthrough" : "Practice Mode"}
        </h3>
        <p style={{ color: "#64748b", fontSize: "0.8rem" }}>
          {mode === "demo"
            ? `Step ${currentStep + 1} of ${steps.length} — follow along in the iframe`
            : "Try the exploit in the iframe. Ask for hints!"}
        </p>
      </div>

      {/* Steps List */}
      <div style={{ flex: 1, overflow: "auto", padding: "0.5rem" }}>
        {steps.length === 0 && mode === "practice" && (
          <div style={{ padding: "1rem", color: "#94a3b8", fontSize: "0.9rem" }}>
            <p>The vulnerable app is loaded on the left. Try to find and exploit the vulnerability!</p>
            <p style={{ marginTop: "0.5rem" }}>Use the hint button below if you get stuck.</p>
          </div>
        )}
        {steps.map((step, i) => (
          <div
            key={i}
            onClick={() => onStepChange(i)}
            style={{
              padding: "0.75rem",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "0.25rem",
              background: i === currentStep ? "#334155" : "transparent",
              borderLeft: i === currentStep ? "3px solid #38bdf8" : "3px solid transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span
                style={{
                  background: "#166534",
                  color: "white",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "3px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                {actionLabels[step.action] || step.action}
              </span>
              <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Step {i + 1}</span>
            </div>
            <p style={{ color: "#e2e8f0", fontSize: "0.85rem", lineHeight: 1.4 }}>
              {step.explanation}
            </p>
            {step.target && (
              <p style={{ color: "#f59e0b", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                Target: <code style={{ background: "#334155", padding: "0.1rem 0.3rem", borderRadius: "3px" }}>{step.target}</code>
                {step.value && (
                  <> Value: <code style={{ background: "#334155", padding: "0.1rem 0.3rem", borderRadius: "3px" }}>{step.value}</code></>
                )}
              </p>
            )}
            {step.whatToObserve && (
              <p style={{ color: "#38bdf8", fontSize: "0.8rem", marginTop: "0.2rem", fontStyle: "italic" }}>
                {step.whatToObserve}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      {mode === "demo" && steps.length > 1 && (
        <div style={{ padding: "0.75rem", borderTop: "1px solid #334155", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            style={{
              flex: 1,
              padding: "0.5rem",
              background: currentStep === 0 ? "#1e293b" : "#334155",
              color: currentStep === 0 ? "#475569" : "#e2e8f0",
              border: "1px solid #475569",
              borderRadius: "4px",
              cursor: currentStep === 0 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <button
            onClick={() => onStepChange(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            style={{
              flex: 1,
              padding: "0.5rem",
              background: currentStep === steps.length - 1 ? "#1e293b" : "#2563eb",
              color: currentStep === steps.length - 1 ? "#475569" : "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentStep === steps.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Hint Panel */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid #334155" }}>
        {hint && (
          <div
            style={{
              background: "#1e3a5f",
              border: "1px solid #3b82f6",
              borderRadius: "6px",
              padding: "0.75rem",
              marginBottom: "0.75rem",
              fontSize: "0.85rem",
              lineHeight: 1.5,
              color: "#e2e8f0",
              maxHeight: "150px",
              overflow: "auto",
            }}
          >
            {hint}
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={hintMessage}
            onChange={(e) => setHintMessage(e.target.value)}
            placeholder="Ask for a hint..."
            style={{
              flex: 1,
              padding: "0.5rem",
              background: "#0f172a",
              border: "1px solid #475569",
              borderRadius: "4px",
              color: "#e2e8f0",
              fontSize: "0.85rem",
            }}
            onKeyDown={(e) => e.key === "Enter" && handleGetHint()}
          />
          <button
            onClick={handleGetHint}
            disabled={loadingHint}
            style={{
              padding: "0.5rem 1rem",
              background: loadingHint ? "#475569" : "#f59e0b",
              color: "#0f172a",
              border: "none",
              borderRadius: "4px",
              cursor: loadingHint ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            {loadingHint ? "..." : "Hint"}
          </button>
        </div>
      </div>
    </div>
  );
}
