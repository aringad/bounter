import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash } from "crypto";

// SHA-256 hash of the lab password
// To change: run `echo -n "yourpassword" | shasum -a 256` and paste the hash here
const PASSWORD_HASH = process.env.PASSWORD_HASH || "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"; // "password"

const TOKEN_COOKIE = "bounter_token";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function generateToken(passwordHash: string): string {
  return createHash("sha256").update(passwordHash + "bounter-salt-2025").digest("hex");
}

const VALID_TOKEN = generateToken(PASSWORD_HASH);

export function isAuthenticated(req: VercelRequest): boolean {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(new RegExp(`${TOKEN_COOKIE}=([^;]+)`));
  return match?.[1] === VALID_TOKEN;
}

export function verifyPassword(password: string): boolean {
  return hashPassword(password) === PASSWORD_HASH;
}

export function getAuthCookieHeader(): string {
  return `${TOKEN_COOKIE}=${VALID_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}

export function getGeminiKey(req: VercelRequest): string | null {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/gemini_key=([^;]+)/);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return null;
    }
  }
  return null;
}

export function sendLoginPage(res: VercelResponse, error?: string): void {
  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mediaform - Security Lab</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #1c1b3a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .login-wrapper {
      width: 100%;
      max-width: 440px;
      padding: 1.5rem;
    }
    .logo-area {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-area img {
      max-width: 220px;
      height: auto;
      margin-bottom: 1rem;
    }
    .logo-area h1 {
      font-size: 1.6rem;
      font-weight: 700;
      color: #e09900;
      letter-spacing: -0.5px;
    }
    .logo-area .subtitle {
      color: #2ea3f2;
      font-size: 0.85rem;
      margin-top: 0.3rem;
      font-weight: 500;
    }
    .login-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 2rem;
      backdrop-filter: blur(10px);
    }
    .login-card h2 {
      color: #fff;
      font-size: 1.2rem;
      margin-bottom: 0.4rem;
    }
    .login-card .desc {
      color: #94a3b8;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
      line-height: 1.5;
    }
    input[type="password"] {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      color: #e2e8f0;
      font-size: 0.95rem;
      font-family: inherit;
      margin-bottom: 1rem;
      transition: border-color 0.2s;
    }
    input[type="password"]:focus {
      outline: none;
      border-color: #e09900;
    }
    button {
      width: 100%;
      background: #e09900;
      color: #1c1b3a;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: inherit;
      transition: background 0.2s;
    }
    button:hover { background: #f0a800; }
    .error {
      background: rgba(220,38,38,0.2);
      border: 1px solid #dc2626;
      padding: 0.6rem 0.8rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: #fca5a5;
    }
    .footer {
      text-align: center;
      margin-top: 2rem;
      color: #64748b;
      font-size: 0.75rem;
    }
    .footer a { color: #2ea3f2; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
    .badge-lab {
      display: inline-block;
      background: #2ea3f2;
      color: #1c1b3a;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="login-wrapper">
    <div class="logo-area">
      <img src="/logo.png" alt="Mediaform" onerror="this.style.display='none'">
      <h1>Mediaform</h1>
      <div class="subtitle">L'informatica a tutti i livelli</div>
    </div>

    <div class="login-card">
      <span class="badge-lab">Security Lab</span>
      <h2>Accedi al laboratorio</h2>
      <p class="desc">
        Piattaforma di training sulla sicurezza web. Esplora le vulnerabilita' OWASP Top 10
        su applicazioni create appositamente a scopo didattico.
      </p>
      ${error ? `<div class="error">${error}</div>` : ""}
      <form method="POST" action="/api/login">
        <input type="password" name="password" placeholder="Password del laboratorio" autofocus required>
        <button type="submit">Accedi</button>
      </form>
    </div>

    <div class="footer">
      <a href="https://media-form.it" target="_blank">media-form.it</a> &mdash; Formazione e innovazione IT a Genova
    </div>
  </div>
</body>
</html>`;
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
