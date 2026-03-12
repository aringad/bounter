import { useState } from "react";
import { Challenge, SessionResponse } from "./types";
import ChallengeList from "./components/ChallengeList";
import ChallengeSession from "./components/ChallengeSession";
import ApiKeyBanner from "./components/ApiKeyBanner";

export default function App() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [sessionData, setSessionData] = useState<SessionResponse | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleBack = () => {
    setSelectedChallenge(null);
    setSessionData(null);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#1c1b3a" }}>
      {/* Header */}
      <header
        style={{
          background: "#1c1b3a",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "0.75rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <img
          src="/logo.png"
          alt="Mediaform"
          style={{ height: "32px", width: "auto" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <h1
          style={{ color: "#e09900", fontSize: "1.3rem", cursor: "pointer", fontWeight: 700 }}
          onClick={handleBack}
        >
          Mediaform
        </h1>
        <span style={{ color: "#2ea3f2", fontSize: "0.8rem", fontWeight: 500 }}>
          Security Lab
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {selectedChallenge && (
            <button
              onClick={handleBack}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "0.35rem 0.8rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Challenges
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: showSettings ? "#e09900" : "rgba(255,255,255,0.1)",
              color: showSettings ? "#1c1b3a" : "#e2e8f0",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "0.35rem 0.8rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: showSettings ? 600 : 400,
            }}
          >
            Impostazioni
          </button>
        </div>
      </header>

      {/* API Key Banner / Settings */}
      <ApiKeyBanner show={showSettings} onClose={() => setShowSettings(false)} />

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {!selectedChallenge ? (
          <ChallengeList onSelect={setSelectedChallenge} />
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
