import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapLayout } from "../../api/vuln/_layout";

const users: Record<string, { username: string; password: string; email: string; role: string; balance: number }> = {
  admin: { username: "admin", password: "supersecretpassword", email: "admin@bounter.local", role: "admin", balance: 10000 },
  alice: { username: "alice", password: "password123", email: "alice@bounter.local", role: "user", balance: 500 },
  bob: { username: "bob", password: "bobpass", email: "bob@bounter.local", role: "user", balance: 250 },
  charlie: { username: "charlie", password: "charlie1", email: "charlie@bounter.local", role: "user", balance: 750 },
};

function parseSessionCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/session=([^;]+)/);
  if (!match) return null;
  try {
    return Buffer.from(match[1], "base64").toString("utf-8");
  } catch {
    return null;
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  // Check for login POST
  if (req.method === "POST") {
    const username = String(req.body?.username || "");
    const password = String(req.body?.password || "");
    const user = users[username];

    if (user && user.password === password) {
      // VULNERABLE: session = base64(username)
      const token = Buffer.from(username).toString("base64");
      res.setHeader("Set-Cookie", `session=${token}; Path=/vuln/broken-auth`);
      res.writeHead(302, { Location: "/vuln/broken-auth" });
      return res.end();
    }

    const html = wrapLayout(
      "Broken Auth",
      renderPage(null, "Invalid credentials.")
    );
    res.setHeader("Content-Type", "text/html");
    return res.send(html);
  }

  // Check for logout
  if (req.query.logout !== undefined) {
    res.setHeader("Set-Cookie", "session=; Path=/vuln/broken-auth; Max-Age=0");
    res.writeHead(302, { Location: "/vuln/broken-auth" });
    return res.end();
  }

  // Check session
  const sessionUser = parseSessionCookie(req.headers.cookie);
  const currentUser = sessionUser ? users[sessionUser] : null;

  const html = wrapLayout("Broken Auth", renderPage(currentUser, null));
  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}

function renderPage(currentUser: any, error: string | null): string {
  if (currentUser) {
    return `<h2>Broken Authentication <span class="badge hard">Challenge</span></h2>
    <div class="card">
      <div class="alert alert-success">Logged in as <strong>${currentUser.username}</strong> (role: ${currentUser.role})</div>
      <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Username</td><td>${currentUser.username}</td></tr>
        <tr><td>Email</td><td>${currentUser.email}</td></tr>
        <tr><td>Role</td><td>${currentUser.role}</td></tr>
        <tr><td>Balance</td><td>$${currentUser.balance}</td></tr>
      </table>
      <a href="/vuln/broken-auth?logout" style="color:#ef4444;display:inline-block;margin-top:0.75rem">Logout</a>
    </div>
    <div class="card">
      <h3>Hints</h3>
      <details><summary>Hint 1</summary><p style="margin-top:0.3rem;color:#94a3b8">Inspect your cookies. What does the session cookie look like?</p></details>
      <details><summary>Hint 2</summary><p style="margin-top:0.3rem;color:#94a3b8">The token looks like Base64. Try decoding it.</p></details>
      <details><summary>Hint 3</summary><p style="margin-top:0.3rem;color:#94a3b8">If the token is <code>base64("alice")</code>, what token gives admin access? Try: <code>document.cookie = "session=" + btoa("admin")</code></p></details>
    </div>`;
  }

  return `<h2>Broken Authentication <span class="badge hard">Challenge</span></h2>
  <div class="card">
    <p style="color:#94a3b8;margin-bottom:0.75rem">This login system uses weak session tokens. Can you forge a session to impersonate the admin?</p>
    ${error ? `<div class="alert alert-danger">${error}</div>` : ""}
    <h3>Login</h3>
    <form method="POST" action="/vuln/broken-auth">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <input type="submit" value="Login">
    </form>
    <p style="margin-top:0.5rem;color:#64748b;font-size:0.85rem">Try: <code>alice</code> / <code>password123</code></p>
  </div>
  <div class="card">
    <h3>Hints</h3>
    <details><summary>Hint 1</summary><p style="margin-top:0.3rem;color:#94a3b8">Login as alice first, then inspect your cookies.</p></details>
    <details><summary>Hint 2</summary><p style="margin-top:0.3rem;color:#94a3b8">The session token looks like Base64 encoding. Try decoding it.</p></details>
    <details><summary>Hint 3</summary><p style="margin-top:0.3rem;color:#94a3b8">If the token is <code>base64("alice")</code>, forge one for admin: <code>document.cookie = "session=" + btoa("admin")</code> then reload.</p></details>
  </div>`;
}
