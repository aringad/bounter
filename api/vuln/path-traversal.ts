import type { VercelRequest, VercelResponse } from "@vercel/node";
import { wrapLayout } from "./_layout";

// Simulated file system
const files: Record<string, string> = {
  "readme.txt": "Welcome to Bounter File Storage!\nThis directory contains user documents.",
  "report.txt": "Q4 2025 Sales Report\n=====================\nRevenue: $1,250,000\nNet Profit: $360,000",
  "../secret.txt": "FLAG{path_traversal_success}",
  "../../../etc/passwd": "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin",
  "../../etc/passwd": "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin",
  "../config.json": '{"database": "sqlite:///app/bounter.db", "secret_key": "bounter-super-secret-key-2025", "debug": true}',
  "../../app/flag.txt": "FLAG{path_traversal_success}",
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  let content = "";
  const filename = String(req.query.file || "");

  if (filename) {
    // VULNERABLE: no path sanitization
    const fileContent = files[filename];
    if (fileContent) {
      content = `<div class="card">
        <h3>File: ${filename.replace(/</g, "&lt;")}</h3>
        ${filename.includes("..") ? '<span class="badge" style="background:#22c55e;margin-bottom:0.5rem;display:inline-block">EXPLOITED!</span>' : ""}
        <pre>${fileContent}</pre>
      </div>`;
    } else {
      content = `<div class="card"><div class="alert alert-danger">Could not read file: ENOENT: no such file or directory '${filename.replace(/</g, "&lt;")}'</div></div>`;
    }
  }

  const html = wrapLayout(
    "Path Traversal",
    `<h2>Path Traversal <span class="badge">Challenge</span></h2>
    <div class="card">
      <p style="color:#94a3b8;margin-bottom:0.75rem">This file viewer downloads documents from the server. Can you read files outside the intended directory?</p>
      <h3>Download a File</h3>
      <form method="GET" action="/vuln/path-traversal">
        <input type="text" name="file" placeholder="Filename (e.g. readme.txt)" value="${filename.replace(/"/g, "&quot;")}" required>
        <input type="submit" value="Download">
      </form>
      <p style="margin-top:0.5rem;color:#64748b;font-size:0.85rem">Available files: <code>readme.txt</code>, <code>report.txt</code></p>
    </div>
    ${content}
    <div class="card">
      <h3>Hints</h3>
      <details><summary>Hint 1</summary><p style="margin-top:0.3rem;color:#94a3b8">The server reads files from a fixed directory. The URL parameter is the filename.</p></details>
      <details><summary>Hint 2</summary><p style="margin-top:0.3rem;color:#94a3b8">What does <code>../</code> mean in a file path?</p></details>
      <details><summary>Hint 3</summary><p style="margin-top:0.3rem;color:#94a3b8">Try: <code>../../../etc/passwd</code></p></details>
    </div>`
  );

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
