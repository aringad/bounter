import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../_auth";
import { wrapLayout } from "./_layout";

let balances: Record<string, number> = {
  admin: 10000,
  alice: 500,
  bob: 250,
  charlie: 750,
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  let message = "";

  if (req.method === "POST") {
    const from = String(req.body?.from || "");
    const to = String(req.body?.to || "");
    const amount = parseFloat(req.body?.amount || "0");

    if (from && to && amount > 0 && balances[from] !== undefined && balances[to] !== undefined) {
      // VULNERABLE: No CSRF token validation
      balances[from] -= amount;
      balances[to] += amount;
      message = `<div class="alert alert-success">Transferred $${amount.toFixed(2)} from ${from} to ${to}</div>`;
    } else {
      message = `<div class="alert alert-danger">Invalid transfer request.</div>`;
    }
  }

  const userRows = Object.entries(balances)
    .map(([u, b]) => `<tr><td>${u}</td><td>$${b.toFixed(2)}</td></tr>`)
    .join("");

  const options = Object.keys(balances)
    .map((u) => `<option value="${u}">${u}</option>`)
    .join("");

  const html = wrapLayout(
    "CSRF Challenge",
    `<h2>Cross-Site Request Forgery (CSRF) <span class="badge medium">Challenge</span></h2>
    <div class="card">
      <p style="color:#94a3b8;margin-bottom:0.75rem">This bank transfer form has no CSRF protection. Can you craft a page that makes a user transfer money?</p>
      ${message}
      <h3>Account Balances</h3>
      <table><tr><th>Username</th><th>Balance</th></tr>${userRows}</table>
    </div>
    <div class="card">
      <h3>Transfer Funds</h3>
      <form method="POST" action="/vuln/csrf">
        <label style="color:#94a3b8;font-size:0.85rem">From:</label>
        <select name="from">${options}</select>
        <label style="color:#94a3b8;font-size:0.85rem">To:</label>
        <select name="to">${options}</select>
        <label style="color:#94a3b8;font-size:0.85rem">Amount:</label>
        <input type="number" name="amount" placeholder="Amount" step="0.01" min="0.01" required>
        <input type="submit" value="Transfer">
      </form>
    </div>
    <div class="card">
      <h3>Attacker Page (for testing)</h3>
      <p style="color:#94a3b8;font-size:0.85rem;margin-bottom:0.5rem">Open browser console and run this to simulate a CSRF attack:</p>
      <pre><code>fetch('/vuln/csrf', {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'from=alice&to=bob&amount=100'
}).then(r => r.text()).then(() => location.reload())</code></pre>
    </div>`
  );

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
