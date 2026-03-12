import { Router, Request, Response } from "express";
import { getDb } from "../../db/init";

const router = Router();

// GET /challenges/csrf - Transfer page
router.get("/", (req: Request, res: Response) => {
  const db = getDb();
  const users = db.prepare("SELECT id, username, balance FROM users").all();
  res.render("challenges/csrf/views/index", {
    title: "CSRF Challenge",
    users,
    message: null,
  });
});

// POST /challenges/csrf/transfer
// VULNERABLE: No CSRF token validation, accepts any POST request
router.post("/transfer", (req: Request, res: Response) => {
  const { from, to, amount } = req.body;
  const db = getDb();

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.render("challenges/csrf/views/index", {
      title: "CSRF Challenge",
      users: db.prepare("SELECT id, username, balance FROM users").all(),
      message: { type: "danger", text: "Invalid amount." },
    });
  }

  // VULNERABLE: No CSRF token check, no origin validation
  db.prepare("UPDATE users SET balance = balance - ? WHERE username = ?").run(numAmount, from);
  db.prepare("UPDATE users SET balance = balance + ? WHERE username = ?").run(numAmount, to);

  const users = db.prepare("SELECT id, username, balance FROM users").all();
  res.render("challenges/csrf/views/index", {
    title: "CSRF Challenge",
    users,
    message: { type: "success", text: `Transferred $${numAmount} from ${from} to ${to}` },
  });
});

export default router;
