export function wrapLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bounter - ${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .navbar { background: #1e293b; padding: 0.75rem 1.5rem; display: flex; align-items: center; gap: 1.5rem; border-bottom: 1px solid #334155; }
    .navbar h1 { color: #38bdf8; font-size: 1.2rem; }
    .navbar a { color: #94a3b8; text-decoration: none; font-size: 0.85rem; }
    .navbar a:hover { color: #38bdf8; }
    .badge { background: #ef4444; color: white; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
    .badge.medium { background: #f59e0b; }
    .badge.easy { background: #22c55e; }
    .container { max-width: 800px; margin: 1.5rem auto; padding: 0 1rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; }
    h2 { color: #38bdf8; margin-bottom: 0.75rem; font-size: 1.2rem; }
    h3 { color: #e2e8f0; margin-bottom: 0.5rem; font-size: 1rem; }
    input, textarea, select { width: 100%; padding: 0.5rem; background: #0f172a; border: 1px solid #475569; border-radius: 4px; color: #e2e8f0; font-size: 0.9rem; margin-bottom: 0.5rem; }
    button, input[type="submit"] { background: #2563eb; color: white; border: none; padding: 0.5rem 1.25rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; }
    button:hover, input[type="submit"]:hover { background: #1d4ed8; }
    .alert { padding: 0.75rem; border-radius: 4px; margin-bottom: 0.75rem; font-size: 0.9rem; }
    .alert-danger { background: #991b1b; border: 1px solid #dc2626; }
    .alert-success { background: #166534; border: 1px solid #22c55e; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #334155; font-size: 0.9rem; }
    th { color: #94a3b8; }
    .post { border-left: 3px solid #38bdf8; padding: 0.5rem 0.75rem; margin-bottom: 0.5rem; background: #0f172a; border-radius: 0 4px 4px 0; }
    .post .author { color: #38bdf8; font-weight: 600; font-size: 0.85rem; }
    code { background: #334155; padding: 0.1rem 0.3rem; border-radius: 3px; font-size: 0.85rem; }
    details { margin-top: 0.4rem; }
    summary { cursor: pointer; color: #38bdf8; font-size: 0.9rem; }
    pre { background: #0f172a; padding: 0.75rem; border-radius: 4px; overflow-x: auto; font-size: 0.8rem; white-space: pre-wrap; }
  </style>
</head>
<body>
  <nav class="navbar">
    <h1>Bounter</h1>
    <a href="/vuln/xss">XSS</a>
    <a href="/vuln/sqli">SQLi</a>
    <a href="/vuln/csrf">CSRF</a>
    <a href="/vuln/cmdi">CmdI</a>
    <a href="/vuln/idor">IDOR</a>
    <a href="/vuln/broken-auth">Auth</a>
    <a href="/vuln/path-traversal">Path</a>
  </nav>
  <div class="container">${body}</div>
</body>
</html>`;
}
