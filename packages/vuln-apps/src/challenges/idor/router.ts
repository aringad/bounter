import { Router, Request, Response } from "express";
import { getDb } from "../../db/init";

const router = Router();

// GET /challenges/idor
router.get("/", (req: Request, res: Response) => {
  res.render("challenges/idor/views/index", {
    title: "IDOR Challenge",
    profile: null,
  });
});

// GET /challenges/idor/profile?id=X
// VULNERABLE: No authorization check - any user can view any profile by changing the ID
router.get("/profile", (req: Request, res: Response) => {
  const id = req.query.id as string;
  const db = getDb();

  // VULNERABLE: Direct object reference without authorization
  const profile = db
    .prepare("SELECT id, username, email, role, balance FROM users WHERE id = ?")
    .get(id);

  res.render("challenges/idor/views/index", {
    title: "IDOR Challenge",
    profile,
  });
});

export default router;
