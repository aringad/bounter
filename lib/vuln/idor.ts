import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapLayout } from "../../api/vuln/_layout";

const users = [
  { id: 1, username: "admin", email: "admin@bounter.local", role: "admin", balance: 10000 },
  { id: 2, username: "alice", email: "alice@bounter.local", role: "user", balance: 500 },
  { id: 3, username: "bob", email: "bob@bounter.local", role: "user", balance: 250 },
  { id: 4, username: "charlie", email: "charlie@bounter.local", role: "user", balance: 750 },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  let profile = "";

  const id = req.query.id;
  if (id) {
    // VULNERABLE: No authorization check
    const user = users.find((u) => u.id === parseInt(String(id)));
    if (user) {
      profile = `<div class="card">
        <h3>User Profile</h3>
        <table>
          <tr><th>Field</th><th>Value</th></tr>
          <tr><td>ID</td><td>${user.id}</td></tr>
          <tr><td>Username</td><td>${user.username}</td></tr>
          <tr><td>Email</td><td>${user.email}</td></tr>
          <tr><td>Role</td><td>${user.role}</td></tr>
          <tr><td>Balance</td><td>$${user.balance}</td></tr>
        </table>
      </div>`;
    } else {
      profile = `<div class="card"><div class="alert alert-danger">User not found.</div></div>`;
    }
  }

  const currentId = id ? String(id) : "2";

  const html = wrapLayout(
    "IDOR Challenge",
    `<h2>Insecure Direct Object Reference (IDOR) <span class="badge medium">Challenge</span></h2>
    <div class="card">
      <p style="color:#94a3b8;margin-bottom:0.75rem">You are logged in as <strong>alice</strong> (ID: 2). Can you access other users' profiles?</p>
      <form action="/vuln/idor" method="get" style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:0.5rem 0.75rem;display:flex;align-items:center;gap:0;margin:0.75rem 0;font-family:monospace;font-size:0.85rem;overflow-x:auto;">
        <span style="color:#22c55e;margin-right:0.4rem;">🔒</span>
        <span style="color:#64748b;white-space:nowrap;">bounter.vercel.app/vuln/idor?id=</span>
        <input name="id" value="${currentId}"
          style="background:transparent;border:none;color:#e2e8f0;font-family:monospace;font-size:0.85rem;width:4rem;outline:none;padding:0;"
          onclick="this.select()">
        <button type="submit" style="background:transparent;border:1px solid #475569;color:#64748b;padding:0.15rem 0.4rem;border-radius:3px;cursor:pointer;font-size:0.72rem;margin-left:auto;white-space:nowrap;">↵</button>
      </form>
      <h3>Your Profile</h3>
      <a href="/vuln/idor?id=2" style="color:#38bdf8">View My Profile</a>
    </div>
    ${profile}
    <div class="card">
      <h3>Hints</h3>
      <details><summary>Hint 1</summary><p style="margin-top:0.3rem;color:#94a3b8">Take a look at the URL bar. Notice anything interesting about how the app identifies your profile?</p></details>
      <details><summary>Hint 2</summary><p style="margin-top:0.3rem;color:#94a3b8">The URL contains a parameter that controls which profile is displayed. What if it had a different value?</p></details>
      <details><summary>Hint 3</summary><p style="margin-top:0.3rem;color:#94a3b8">Try editing the URL directly in the address bar above. Change the number after <code>id=</code> and press Enter.</p></details>
    </div>`
  );

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
