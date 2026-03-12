import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapLayout } from "../../api/vuln/_layout";

// Simulated database (educational — mimics how SQL injection works)
const users = [
  { id: 1, username: "admin", password: "supersecretpassword", role: "admin", email: "admin@bounter.local", balance: 10000 },
  { id: 2, username: "alice", password: "password123", role: "user", email: "alice@bounter.local", balance: 500 },
  { id: 3, username: "bob", password: "bobpass", role: "user", email: "bob@bounter.local", balance: 250 },
  { id: 4, username: "charlie", password: "charlie1", role: "user", email: "charlie@bounter.local", balance: 750 },
];

// Simulated vulnerable SQL query (educational — shows how SQLi works without real DB)
function simulateSqlLogin(username: string, password: string): { user: any; query: string; error?: string } {
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  // Detect SQL injection patterns
  if (username.includes("'") || password.includes("'")) {
    // Simulate OR 1=1 bypass
    if (username.match(/'.*OR.*1\s*=\s*1/i) || password.match(/'.*OR.*1\s*=\s*1/i)) {
      return { user: users[0], query }; // Returns first user (admin)
    }
    // Simulate comment bypass (-- or #)
    if (username.includes("--") || username.includes("#")) {
      const nameBeforeQuote = username.split("'")[0];
      const found = users.find((u) => u.username === nameBeforeQuote);
      if (found) return { user: found, query };
      // admin'-- pattern
      if (nameBeforeQuote === "admin") return { user: users[0], query };
    }
    // Simulate UNION injection
    if (username.toUpperCase().includes("UNION")) {
      return { user: null, query, error: `SQL returned multiple result sets. Extracted data: ${JSON.stringify(users.map((u) => ({ id: u.id, username: u.username, role: u.role })))}` };
    }
    // Generic SQL error for malformed injection
    return { user: null, query, error: `SQLITE_ERROR: near "'": syntax error in: ${query}` };
  }

  const found = users.find((u) => u.username === username && u.password === password);
  return { user: found || null, query };
}

function simulateSqlSearch(search: string): { results: any[]; query: string; error?: string } {
  const query = `SELECT id, username, email, role FROM users WHERE username LIKE '%${search}%'`;

  if (search.includes("'")) {
    // UNION SELECT simulation
    if (search.toUpperCase().includes("UNION")) {
      return {
        results: users.map((u) => ({ id: u.id, username: u.username, email: u.email, role: u.role })),
        query,
      };
    }
    // ' OR '1'='1 pattern
    if (search.match(/'.*OR.*'?1'?\s*=\s*'?1/i)) {
      return { results: users.map((u) => ({ id: u.id, username: u.username, email: u.email, role: u.role })), query };
    }
    return { results: [], query, error: `SQLITE_ERROR: near "'": syntax error in: ${query}` };
  }

  const results = users
    .filter((u) => u.username.includes(search))
    .map((u) => ({ id: u.id, username: u.username, email: u.email, role: u.role }));
  return { results, query };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  let alert = "";
  let searchResults = "";

  // POST /vuln/sqli — login attempt
  if (req.method === "POST") {
    const username = String(req.body?.username || "");
    const password = String(req.body?.password || "");
    const { user, query, error } = simulateSqlLogin(username, password);

    if (error) {
      alert = `<div class="alert alert-danger">Database error: ${error}</div>`;
    } else if (user) {
      alert = `<div class="alert alert-success">Welcome back, <strong>${user.username}</strong>! Role: <strong>${user.role}</strong>. Balance: <strong>$${user.balance}</strong></div>`;
    } else {
      alert = `<div class="alert alert-danger">Invalid username or password.</div>`;
    }
    alert += `<div style="margin-bottom:0.75rem"><code style="font-size:0.75rem;word-break:break-all">Query: ${query.replace(/</g, "&lt;")}</code></div>`;
  }

  // GET ?username= — search
  if (req.query.username) {
    const search = String(req.query.username);
    const { results, query, error } = simulateSqlSearch(search);

    if (error) {
      alert = `<div class="alert alert-danger">Database error: ${error}</div>`;
    }
    alert += `<div style="margin-bottom:0.75rem"><code style="font-size:0.75rem;word-break:break-all">Query: ${query.replace(/</g, "&lt;")}</code></div>`;

    if (results.length > 0) {
      searchResults = `<table style="margin-top:0.75rem"><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th></tr>
        ${results.map((r) => `<tr><td>${r.id}</td><td>${r.username}</td><td>${r.email}</td><td>${r.role}</td></tr>`).join("")}
      </table>`;
    }
  }

  const html = wrapLayout(
    "SQL Injection",
    `<h2>SQL Injection <span class="badge medium">Challenge</span></h2>
    <div class="card">
      <p style="color:#94a3b8;margin-bottom:0.75rem">This login form connects to a database. Can you bypass authentication?</p>
      ${alert}
      <h3>Login</h3>
      <form method="POST" action="/vuln/sqli">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="submit" value="Login">
      </form>
    </div>
    <div class="card">
      <h3>User Search</h3>
      <form method="GET" action="/vuln/sqli">
        <input type="text" name="username" placeholder="Search username..." required>
        <input type="submit" value="Search">
      </form>
      ${searchResults}
    </div>
    <div class="card">
      <h3>Hints</h3>
      <details><summary>Hint 1</summary><p style="margin-top:0.3rem;color:#94a3b8">Think about how SQL queries are built with string concatenation.</p></details>
      <details><summary>Hint 2</summary><p style="margin-top:0.3rem;color:#94a3b8">What happens if a username contains a single quote (<code>'</code>)?</p></details>
      <details><summary>Hint 3</summary><p style="margin-top:0.3rem;color:#94a3b8">Try: <code>' OR 1=1 --</code> as the username.</p></details>
    </div>`
  );

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
