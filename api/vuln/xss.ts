import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../_auth";
import { wrapLayout } from "./_layout";

// In-memory posts store (resets on cold start, which is fine for educational purposes)
let posts = [
  { author: "alice", content: "Welcome to the Bounter forum!", date: "2025-01-01" },
  { author: "bob", content: "Has anyone tried the new features?", date: "2025-01-02" },
  { author: "admin", content: "Please report any security issues.", date: "2025-01-03" },
];

function renderPosts(postList: typeof posts): string {
  if (postList.length === 0) return '<p style="color:#64748b">No posts found.</p>';
  return postList
    .map(
      (p) => `<div class="post">
      <span class="author">${p.author}</span> <span style="color:#64748b;font-size:0.8rem">${p.date}</span>
      <p style="margin-top:0.3rem">${p.content}</p>
    </div>`
    )
    .join("");
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  // POST — add a new post (Stored XSS)
  if (req.method === "POST") {
    const author = String(req.body?.author || "anonymous");
    const content = String(req.body?.content || "");
    if (content) {
      // VULNERABLE: stored without sanitization
      posts.push({ author, content, date: new Date().toISOString().split("T")[0] });
    }
    res.writeHead(302, { Location: "/vuln/xss" });
    return res.end();
  }

  // GET with ?q= — search (Reflected XSS)
  const query = String(req.query.q || "");

  if (query) {
    const results = posts.filter((p) => p.content.toLowerCase().includes(query.toLowerCase()));
    // VULNERABLE: query rendered without escaping
    const html = wrapLayout(
      "XSS - Search",
      `<h2>Search Results <span class="badge easy">XSS</span></h2>
      <div class="card">
        <p>Results for: <strong>${query}</strong></p>
        <form method="GET" action="/vuln/xss" style="margin-top:0.75rem">
          <input type="text" name="q" value="${query}" placeholder="Search...">
          <input type="submit" value="Search">
        </form>
      </div>
      <div class="card">${renderPosts(results)}</div>
      <a href="/vuln/xss" style="color:#38bdf8">Back to forum</a>`
    );
    res.setHeader("Content-Type", "text/html");
    return res.send(html);
  }

  // Main page
  const html = wrapLayout(
    "XSS Challenge",
    `<h2>Cross-Site Scripting (XSS) <span class="badge easy">Challenge</span></h2>
    <div class="card">
      <p style="color:#94a3b8;margin-bottom:0.75rem">This forum allows users to post messages. Can you inject JavaScript?</p>
      <h3>Search Posts</h3>
      <form method="GET" action="/vuln/xss">
        <input type="text" name="q" placeholder="Search posts...">
        <input type="submit" value="Search">
      </form>
    </div>
    <div class="card">
      <h3>Post a Message</h3>
      <form method="POST" action="/vuln/xss">
        <input type="text" name="author" placeholder="Your name" required>
        <textarea name="content" rows="3" placeholder="Write your message..." required></textarea>
        <input type="submit" value="Post Message">
      </form>
    </div>
    <div class="card">
      <h3>Forum Posts</h3>
      ${renderPosts(posts)}
    </div>`
  );

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
