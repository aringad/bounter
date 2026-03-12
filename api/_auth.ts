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
  // Token = hash of (passwordHash + a fixed salt) — validates the user knew the password
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

export function sendLoginPage(res: VercelResponse, error?: string): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bounter - Login</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0a0e1a; color: #e2e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .login-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 2.5rem; width: 100%; max-width: 400px; }
    h1 { color: #38bdf8; font-size: 1.8rem; margin-bottom: 0.5rem; }
    p { color: #94a3b8; margin-bottom: 1.5rem; font-size: 0.9rem; }
    input[type="password"] { width: 100%; padding: 0.75rem; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: #e2e8f0; font-size: 1rem; margin-bottom: 1rem; }
    input[type="password"]:focus { outline: none; border-color: #38bdf8; }
    button { width: 100%; background: #2563eb; color: white; border: none; padding: 0.75rem; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 600; }
    button:hover { background: #1d4ed8; }
    .error { background: #991b1b; border: 1px solid #dc2626; padding: 0.6rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="login-card">
    <h1>Bounter</h1>
    <p>Security Training Lab — enter the password to access.</p>
    ${error ? `<div class="error">${error}</div>` : ""}
    <form method="POST" action="/api/login">
      <input type="password" name="password" placeholder="Lab password" autofocus required>
      <button type="submit">Enter Lab</button>
    </form>
  </div>
</body>
</html>`;
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
