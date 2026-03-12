import { useEffect, useState } from "react";
import { Challenge } from "../types";
import { fetchChallenges } from "../services/api";

const difficultyColors: Record<string, string> = {
  easy: "#22c55e",
  medium: "#f59e0b",
  hard: "#ef4444",
};

const categoryIcons: Record<string, string> = {
  Injection: ">>",
  Session: "**",
  "Access Control": "##",
};

interface Props {
  onSelect: (challenge: Challenge) => void;
}

export default function ChallengeList({ onSelect }: Props) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges()
      .then(setChallenges)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#64748b" }}>Caricamento challenges...</p>;
  if (error) return <p style={{ color: "#ef4444" }}>Errore: {error}</p>;

  return (
    <div>
      <h2 style={{ color: "#e09900", marginBottom: "0.5rem" }}>Challenges</h2>
      <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
        Seleziona una vulnerabilita' da esplorare. Ogni challenge gira su un'app vulnerabile creata appositamente.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        {challenges.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "1.25rem",
              cursor: "pointer",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#e09900";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                {categoryIcons[c.category] || ""} {c.category}
              </span>
              <span
                style={{
                  background: difficultyColors[c.difficulty],
                  color: "white",
                  padding: "0.15rem 0.6rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {c.difficulty}
              </span>
            </div>
            <h3 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>{c.title}</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5 }}>
              {c.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
