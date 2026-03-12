import { Router } from "express";
import challenges from "../data/challenges.json";

const router = Router();

// GET /api/challenges
router.get("/", (req, res) => {
  res.json(challenges);
});

// GET /api/challenges/:id
router.get("/:id", (req, res) => {
  const challenge = challenges.find((c) => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ error: "Challenge not found" });
  }
  res.json(challenge);
});

export default router;
