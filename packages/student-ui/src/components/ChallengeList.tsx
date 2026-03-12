import { useEffect, useState } from "react";
import { Challenge } from "../types";
import { fetchChallenges } from "../services/api";
import { Lang, t } from "../i18n";

const difficultyColors: Record<string, string> = {
  beginner: "#2ea3f2",
  easy: "#22c55e",
  medium: "#f59e0b",
  hard: "#ef4444",
};

const categoryIcons: Record<string, string> = {
  Awareness: "🛡️",
  Injection: ">>",
  Session: "**",
  "Access Control": "##",
};

interface Props {
  onSelect: (challenge: Challenge) => void;
  lang: Lang;
}

function ChallengeCard({ c, lang, onSelect }: { c: Challenge; lang: Lang; onSelect: (c: Challenge) => void }) {
  const descKey = `desc.${c.id}` as any;
  const localDesc = t(descKey, lang);
  const difficulty = t(c.difficulty as any, lang);

  return (
    <div
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

  const general = challenges.filter((c) => c.type === "general");
  const technical = challenges.filter((c) => c.type === "technical");

  return (
    <div>
      {/* General Security Section */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <h2 style={{ color: "#2ea3f2" }}>{t("generalSection", lang)}</h2>
          <span style={{
            background: "#2ea3f2",
            color: "#1c1b3a",
            padding: "0.15rem 0.5rem",
            borderRadius: "4px",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
          }}>
            {lang === "it" ? "Quiz" : "Quiz"}
          </span>
        </div>
        <p style={{ color: "#94a3b8", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
          {t("generalSubtitle", lang)}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {general.map((c) => (
            <ChallengeCard key={c.id} c={c} lang={lang} onSelect={onSelect} />
          ))}
        </div>
      </div>

      {/* Technical Security Section (pro only) */}
      {technical.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <h2 style={{ color: "#e09900" }}>{t("technicalSection", lang)}</h2>
            <span style={{
              background: "#e09900",
              color: "#1c1b3a",
              padding: "0.15rem 0.5rem",
              borderRadius: "4px",
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
            }}>
              OWASP + AI
            </span>
          </div>
          <p style={{ color: "#94a3b8", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
            {t("technicalSubtitle", lang)}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1rem",
            }}
          >
            {technical.map((c) => (
              <ChallengeCard key={c.id} c={c} lang={lang} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
