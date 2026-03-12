import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "./_auth";

const challenges = [
  {
    id: "xss",
    title: "Cross-Site Scripting (XSS)",
    category: "Injection",
    difficulty: "easy",
    description: "Inject JavaScript into a forum with reflected and stored XSS vulnerabilities.",
    targetPath: "/vuln/xss",
  },
  {
    id: "sqli",
    title: "SQL Injection",
    category: "Injection",
    difficulty: "medium",
    description: "Bypass authentication and extract data through SQL injection.",
    targetPath: "/vuln/sqli",
  },
  {
    id: "csrf",
    title: "Cross-Site Request Forgery (CSRF)",
    category: "Session",
    difficulty: "medium",
    description: "Forge cross-site requests to transfer funds without CSRF protection.",
    targetPath: "/vuln/csrf",
  },
  {
    id: "cmdi",
    title: "Command Injection",
    category: "Injection",
    difficulty: "hard",
    description: "Exploit a ping utility that passes user input directly to a shell command.",
    targetPath: "/vuln/cmdi",
  },
  {
    id: "idor",
    title: "Insecure Direct Object Reference (IDOR)",
    category: "Access Control",
    difficulty: "medium",
    description: "Access other users' profiles by manipulating predictable object identifiers.",
    targetPath: "/vuln/idor",
  },
  {
    id: "broken-auth",
    title: "Broken Authentication",
    category: "Session",
    difficulty: "hard",
    description: "Forge session tokens to impersonate the admin user.",
    targetPath: "/vuln/broken-auth",
  },
  {
    id: "path-traversal",
    title: "Path Traversal",
    category: "Access Control",
    difficulty: "hard",
    description: "Escape the file directory and read sensitive files from the server.",
    targetPath: "/vuln/path-traversal",
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  if (id) {
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) return res.status(404).json({ error: "Not found" });
    return res.json(challenge);
  }

  return res.json(challenges);
}
