import { useState } from "react";
import { Challenge, SessionResponse, StepResult } from "./types";
import ChallengeList from "./components/ChallengeList";
import ChallengeSession from "./components/ChallengeSession";

export default function App() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [sessionData, setSessionData] = useState<SessionResponse | null>(null);

  const handleBack = () => {
    setSelectedChallenge(null);
    setSessionData(null);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          background: "#1e293b",
          borderBottom: "1px solid #334155",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <h1
          style={{ color: "#38bdf8", fontSize: "1.5rem", cursor: "pointer" }}
          onClick={handleBack}
        >
          Bounter
        </h1>
        <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
          Security Training Platform
        </span>
        {selectedChallenge && (
          <button
            onClick={handleBack}
            style={{
              marginLeft: "auto",
              background: "#334155",
              color: "#e2e8f0",
              border: "none",
              padding: "0.4rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back to Challenges
          </button>
        )}
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {!selectedChallenge ? (
          <ChallengeList
            onSelect={setSelectedChallenge}
          />
        ) : (
          <ChallengeSession
            challenge={selectedChallenge}
            sessionData={sessionData}
            onSessionData={setSessionData}
          />
        )}
      </main>
    </div>
  );
}
