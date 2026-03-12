import { useEffect, useState } from "react";
import { Challenge } from "../types";
import { fetchChallenges } from "../services/api";
import { Lang, t } from "../i18n";

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
  lang: Lang;
}

export default function ChallengeList({ onSelect, lang }: Props) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges()
      .then(setChallenges)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#64748b" }}>{t("loadingChallenges", lang)}</p>;
  if (error) return <p style={{ color: "#ef4444" }}>{t("error", lang)}: {error}</p>;

  return (
    <div>
      <h2 style={{ color: "#e09900", marginBottom: "0.5rem" }}>{t("challengesTitle", lang)}</h2>
      <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
        {t("challengesSubtitle", lang)}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        {challenges.map((c) => {
          const descKey = `desc.${c.id}` as any;
          const localDesc = t(descKey, lang);
          const difficulty = t(c.difficulty as any, lang);

          return (
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
                  {difficulty}
                </span>
              </div>
              <h3 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>{c.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {localDesc !== descKey ? localDesc : c.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
