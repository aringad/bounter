import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, getAuthTier } from "./_auth";

const challenges = [
  // === General Cybersecurity (Beginner, no AI) ===
  {
    id: "phishing",
    title: "Riconosci il Phishing",
    category: "Awareness",
    difficulty: "beginner",
    description: "Analizza email sospette e impara a distinguere i messaggi di phishing da quelli legittimi.",
    targetPath: "/vuln/phishing",
    type: "general",
  },
  {
    id: "sender",
    title: "Analizza il Mittente",
    category: "Awareness",
    difficulty: "beginner",
    description: "Impara a verificare l'autenticità dei mittenti email analizzando domini e indirizzi.",
    targetPath: "/vuln/sender",
    type: "general",
  },
  {
    id: "passwords",
    title: "Password Sicure",
    category: "Awareness",
    difficulty: "beginner",
    description: "Scopri cosa rende una password sicura e testa la forza delle tue password.",
    targetPath: "/vuln/passwords",
    type: "general",
  },
  {
    id: "suspicious-urls",
    title: "URL Sospetti",
    category: "Awareness",
    difficulty: "beginner",
    description: "Impara a riconoscere link pericolosi prima di cliccarci sopra.",
    targetPath: "/vuln/suspicious-urls",
    type: "general",
  },
  {
    id: "social-engineering",
    title: "Ingegneria Sociale",
    category: "Awareness",
    difficulty: "beginner",
    description: "Riconosci i tentativi di manipolazione e impara a difenderti dal social engineering.",
    targetPath: "/vuln/social-engineering",
    type: "general",
  },
  {
    id: "permissions",
    title: "Permessi App e Privacy",
    category: "Awareness",
    difficulty: "beginner",
    description: "Valuta quali permessi sono ragionevoli per un'app e quali sono sospetti.",
    targetPath: "/vuln/permissions",
    type: "general",
  },
  {
    id: "public-wifi",
    title: "Wi-Fi Pubblico",
    category: "Awareness",
    difficulty: "beginner",
    description: "Impara i rischi delle reti Wi-Fi pubbliche e come proteggerti.",
    targetPath: "/vuln/public-wifi",
    type: "general",
  },
  {
    id: "backup",
    title: "Aggiornamenti e Backup",
    category: "Awareness",
    difficulty: "beginner",
    description: "Conosci le buone pratiche per aggiornamenti, backup e protezione dai ransomware.",
    targetPath: "/vuln/backup",
    type: "general",
  },
  {
    id: "fake-notifications",
    title: "Notifiche Fasulle",
    category: "Awareness",
    difficulty: "beginner",
    description: "Impara a distinguere le notifiche del browser legittime da quelle fasulle usate per truffe e malware.",
    targetPath: "/vuln/fake-notifications",
    type: "general",
  },
  {
    id: "qr-codes",
    title: "Truffe con QR Code",
    category: "Awareness",
    difficulty: "beginner",
    description: "Impara a riconoscere QR Code truffa e a proteggerti dal quishing.",
    targetPath: "/vuln/qr-codes",
    type: "general",
  },
  // === Technical Cybersecurity (with AI) ===
  {
    id: "xss",
    title: "Cross-Site Scripting (XSS)",
    category: "Injection",
    difficulty: "easy",
    description: "Inject JavaScript into a forum with reflected and stored XSS vulnerabilities.",
    targetPath: "/vuln/xss",
    type: "technical",
  },
  {
    id: "sqli",
    title: "SQL Injection",
    category: "Injection",
    difficulty: "medium",
    description: "Bypass authentication and extract data through SQL injection.",
    targetPath: "/vuln/sqli",
    type: "technical",
  },
  {
    id: "csrf",
    title: "Cross-Site Request Forgery (CSRF)",
    category: "Session",
    difficulty: "medium",
    description: "Forge cross-site requests to transfer funds without CSRF protection.",
    targetPath: "/vuln/csrf",
    type: "technical",
  },
  {
    id: "cmdi",
    title: "Command Injection",
    category: "Injection",
    difficulty: "hard",
    description: "Exploit a ping utility that passes user input directly to a shell command.",
    targetPath: "/vuln/cmdi",
    type: "technical",
  },
  {
    id: "idor",
    title: "Insecure Direct Object Reference (IDOR)",
    category: "Access Control",
    difficulty: "medium",
    description: "Access other users' profiles by manipulating predictable object identifiers.",
    targetPath: "/vuln/idor",
    type: "technical",
  },
  {
    id: "broken-auth",
    title: "Broken Authentication",
    category: "Session",
    difficulty: "hard",
    description: "Forge session tokens to impersonate the admin user.",
    targetPath: "/vuln/broken-auth",
    type: "technical",
  },
  {
    id: "path-traversal",
    title: "Path Traversal",
    category: "Access Control",
    difficulty: "hard",
    description: "Escape the file directory and read sensitive files from the server.",
    targetPath: "/vuln/path-traversal",
    type: "technical",
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });

  const tier = getAuthTier(req);

  const { id } = req.query;
  if (id) {
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) return res.status(404).json({ error: "Not found" });
    return res.json(challenge);
  }

  // Basic users only see general challenges
  const filtered = tier === "pro" ? challenges : challenges.filter(c => c.type === "general");
  return res.json(filtered);
}
