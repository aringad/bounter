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
      <div style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:0.5rem 0.75rem;display:flex;align-items:center;gap:0.5rem;margin:0.75rem 0;font-family:monospace;font-size:0.88rem;">
        <span style="color:#22c55e;">🔒</span>
        <span style="color:#64748b;">bounter.vercel.app/vuln/idor?id=</span>
        <input id="id-input" type="number" min="1" max="99" value="${currentId}"
          style="width:3rem;background:#1e293b;border:1px solid #475569;border-radius:4px;color:#f59e0b;font-family:monospace;font-size:1rem;font-weight:700;padding:0.25rem 0.4rem;text-align:center;outline:none;"
          onkeydown="if(event.key==='Enter')document.getElementById('go-btn').click()">
        <button id="go-btn" onclick="window.location.href='/vuln/idor?id='+document.getElementById('id-input').value"
          style="background:#e09900;color:#1c1b3a;border:none;padding:0.3rem 0.75rem;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.82rem;font-family:inherit;">Go</button>
      </div>
      <p style="color:#64748b;font-size:0.78rem;">👆 Try changing the ID number and press Go</p>
    </div>
    ${profile}
    <div class="card">
      <h3>Hints</h3>
      <details><summary>Hint 1</summary><p style="margin-top:0.3rem;color:#94a3b8">Look at the URL bar above. You're viewing profile with <code>id=${currentId}</code>.</p></details>
      <details><summary>Hint 2</summary><p style="margin-top:0.3rem;color:#94a3b8">What happens if you change the ID to <code>1</code>? Who might have ID 1?</p></details>
    </div>`
  );

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
