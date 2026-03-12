import { Router, Request, Response } from "express";
import { getDb } from "../../db/init";

const router = Router();

// GET /challenges/broken-auth
router.get("/", (req: Request, res: Response) => {
  const session = req.cookies?.session;
  let currentUser = null;

  if (session) {
    try {
      // VULNERABLE: Session token is just base64-encoded username
      const username = Buffer.from(session, "base64").toString("utf-8");
      const db = getDb();
      currentUser = db
        .prepare("SELECT id, username, email, role, balance FROM users WHERE username = ?")
        .get(username);
    } catch {}
  }

  res.render("challenges/broken-auth/views/index", {
    title: "Broken Auth Challenge",
    currentUser,
    error: null,
  });
});

// POST /challenges/broken-auth/login
// VULNERABLE: Weak session management - session is just base64(username)
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const db = getDb();

  const user = db
    .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
    .get(username, password) as any;

  if (user) {
    // VULNERABLE: Session token is predictable (base64 of username)
    const sessionToken = Buffer.from(user.username).toString("base64");
    res.cookie("session", sessionToken, { httpOnly: false }); // VULNERABLE: no httpOnly
    res.redirect("/challenges/broken-auth");
  } else {
    res.render("challenges/broken-auth/views/index", {
      title: "Broken Auth Challenge",
      currentUser: null,
      error: "Invalid credentials.",
    });
  }
});

// GET /challenges/broken-auth/logout
router.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("session");
  res.redirect("/challenges/broken-auth");
});

export default router;
