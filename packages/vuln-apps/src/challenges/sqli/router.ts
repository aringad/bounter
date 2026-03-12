import { Router, Request, Response } from "express";
import { getDb } from "../../db/init";

const router = Router();

// GET /challenges/sqli - Login page
router.get("/", (req: Request, res: Response) => {
  res.render("challenges/sqli/views/index", {
    title: "SQL Injection Challenge",
    error: null,
    success: null,
    searchResults: null,
  });
});

// POST /challenges/sqli/login
// VULNERABLE: SQL query built with string concatenation
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const db = getDb();

  // VULNERABLE: Direct string interpolation in SQL query
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  try {
    const user = db.prepare(query).get() as any;

    if (user) {
      res.render("challenges/sqli/views/index", {
        title: "SQL Injection Challenge",
        error: null,
        success: `Welcome back, <strong>${user.username}</strong>! Role: <strong>${user.role}</strong>. Balance: <strong>$${user.balance}</strong>`,
        searchResults: null,
      });
    } else {
      res.render("challenges/sqli/views/index", {
        title: "SQL Injection Challenge",
        error: "Invalid username or password.",
        success: null,
        searchResults: null,
      });
    }
  } catch (err: any) {
    // VULNERABLE: Exposing database error messages
    res.render("challenges/sqli/views/index", {
      title: "SQL Injection Challenge",
      error: `Database error: ${err.message}`,
      success: null,
      searchResults: null,
    });
  }
});

// GET /challenges/sqli/search
// VULNERABLE: SQL injection in search query
router.get("/search", (req: Request, res: Response) => {
  const username = req.query.username as string;
  const db = getDb();

  // VULNERABLE: String concatenation in SQL query
  const query = `SELECT id, username, email, role FROM users WHERE username LIKE '%${username}%'`;

  try {
    const results = db.prepare(query).all();
    res.render("challenges/sqli/views/index", {
      title: "SQL Injection Challenge",
      error: null,
      success: null,
      searchResults: results,
    });
  } catch (err: any) {
    res.render("challenges/sqli/views/index", {
      title: "SQL Injection Challenge",
      error: `Database error: ${err.message}`,
      success: null,
      searchResults: null,
    });
  }
});

export default router;
