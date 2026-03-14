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

interface SectionConfig {
  type: string;
  titleKey: string;
  subtitleKey: string;
  color: string;
  badge: string;
  icon: string;
}

const sections: SectionConfig[] = [
  { type: "general", titleKey: "generalSection", subtitleKey: "generalSubtitle", color: "#2ea3f2", badge: "Quiz", icon: "🛡️" },
  { type: "networking", titleKey: "networkingSection", subtitleKey: "networkingSubtitle", color: "#8b5cf6", badge: "Lab", icon: "🔌" },
  { type: "dns", titleKey: "dnsSection", subtitleKey: "dnsSubtitle", color: "#06b6d4", badge: "Lab", icon: "🌐" },
  { type: "tcp-udp", titleKey: "tcpUdpSection", subtitleKey: "tcpUdpSubtitle", color: "#f97316", badge: "Lab", icon: "🔗" },
  { type: "technical", titleKey: "technicalSection", subtitleKey: "technicalSubtitle", color: "#e09900", badge: "OWASP + AI", icon: "⚔️" },
];

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
          {c.category}
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

  return (
    <div>
      {sections.map((section) => {
        const items = challenges.filter((c) => c.type === section.type);
        if (items.length === 0) return null;
        return (
          <div key={section.type} style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <h2 style={{ color: section.color }}>
                {section.icon} {t(section.titleKey as any, lang)}
              </h2>
              <span style={{
                background: section.color,
                color: "#1c1b3a",
                padding: "0.15rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}>
                {section.badge}
              </span>
            </div>
            <p style={{ color: "#94a3b8", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
              {t(section.subtitleKey as any, lang)}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {items.map((c) => (
                <ChallengeCard key={c.id} c={c} lang={lang} onSelect={onSelect} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
