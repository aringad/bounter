import { Router, Request, Response } from "express";
import { getDb } from "../../db/init";

const router = Router();

// GET /challenges/xss - Forum page
router.get("/", (req: Request, res: Response) => {
  const db = getDb();
  const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
  res.render("challenges/xss/views/index", { title: "XSS Challenge", posts });
});

// GET /challenges/xss/search - Reflected XSS
// VULNERABLE: query parameter is rendered without escaping in the search results page
router.get("/search", (req: Request, res: Response) => {
  const query = (req.query.q as string) || "";
  const db = getDb();
  const results = db
    .prepare("SELECT * FROM posts WHERE content LIKE ? ORDER BY created_at DESC")
    .all(`%${query}%`);
  res.render("challenges/xss/views/search", {
    title: "XSS - Search",
    query,
    results,
  });
});

// POST /challenges/xss/post - Stored XSS
// VULNERABLE: post content is stored and rendered without sanitization
router.post("/post", (req: Request, res: Response) => {
  const { author, content } = req.body;
  if (author && content) {
    const db = getDb();
    db.prepare("INSERT INTO posts (author, content) VALUES (?, ?)").run(
      author,
      content
    );
  }
  res.redirect("/challenges/xss");
});

export default router;
