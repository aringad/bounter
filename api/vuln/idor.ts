import type { VercelRequest, VercelResponse } from "@vercel/node";
import { wrapLayout } from "./_layout";

const users = [
  { id: 1, username: "admin", email: "admin@bounter.local", role: "admin", balance: 10000 },
  { id: 2, username: "alice", email: "alice@bounter.local", role: "user", balance: 500 },
  { id: 3, username: "bob", email: "bob@bounter.local", role: "user", balance: 250 },
  { id: 4, username: "charlie", email: "charlie@bounter.local", role: "user", balance: 750 },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
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

  const html = wrapLayout(
    "IDOR Challenge",
    `<h2>Insecure Direct Object Reference (IDOR) <span class="badge medium">Challenge</span></h2>
    <div class="card">
      <p style="color:#94a3b8;margin-bottom:0.75rem">You are logged in as <strong>alice</strong> (ID: 2). Can you access other users' profiles?</p>
      <h3>Your Profile</h3>
      <a href="/vuln/idor?id=2" style="color:#38bdf8">View My Profile (ID: 2)</a>
    </div>
    ${profile}
    <div class="card">
      <h3>Hints</h3>
      <details><summary>Hint 1</summary><p style="margin-top:0.3rem;color:#94a3b8">Look at the URL when you view your profile. Notice the <code>id</code> parameter.</p></details>
      <details><summary>Hint 2</summary><p style="margin-top:0.3rem;color:#94a3b8">What happens if you change <code>id=2</code> to <code>id=1</code>?</p></details>
    </div>`
  );

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
