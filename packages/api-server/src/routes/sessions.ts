import { Router } from "express";
import challenges from "../data/challenges.json";
import { createSession, getSession, deleteSession, listSessions, updateSession } from "../services/session-manager";
import { generateDemoSteps, generateHint } from "../services/claude";
import { executeTask, closeAgentSession, getPageHtml } from "../services/agent-bridge";
import { Challenge } from "../types";

const VULN_APP_URL = process.env.VULN_APP_URL || "http://vuln-apps:5000";

const router = Router();

// GET /api/sessions
router.get("/", (req, res) => {
  res.json(listSessions());
});

// POST /api/sessions - Start a new demo or practice session
router.post("/", async (req, res) => {
  const { challengeId, mode = "demo" } = req.body;

  const challenge = challenges.find((c) => c.id === challengeId) as Challenge | undefined;
  if (!challenge) {
    return res.status(400).json({ error: "Invalid challenge ID" });
  }

  const session = createSession(challengeId, mode);
  const targetUrl = `${VULN_APP_URL}${challenge.targetPath}`;

  try {
    if (mode === "demo") {
      // Generate steps from Claude
      const steps = await generateDemoSteps({
        challenge,
        targetUrl,
        mode: "demo",
      });

      // Execute steps via AI agent
      const result = await executeTask(session.id, challengeId, targetUrl, steps);

      updateSession(session.id, { status: "completed" });

      res.json({
        session,
        steps: result.results,
        status: result.status,
      });
    } else {
      // Practice mode: just create the session and navigate to the page
      const navStep = [
        {
          action: "navigate" as const,
          url: targetUrl,
          explanation: "Navigating to the challenge page.",
        },
        {
          action: "screenshot" as const,
          explanation: "Here's the challenge page. Try to find and exploit the vulnerability!",
        },
      ];

      const result = await executeTask(session.id, challengeId, targetUrl, navStep);

      res.json({
        session,
        steps: result.results,
        status: "ready",
      });
    }
  } catch (err: any) {
    updateSession(session.id, { status: "error" });
    res.status(500).json({ error: err.message, session });
  }
});

// POST /api/sessions/:id/hint - Get a hint for practice mode
router.post("/:id/hint", async (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  const challenge = challenges.find((c) => c.id === session.challengeId) as Challenge | undefined;
  if (!challenge) {
    return res.status(400).json({ error: "Challenge not found" });
  }

  const targetUrl = `${VULN_APP_URL}${challenge.targetPath}`;

  try {
    // Get current page state
    let pageHtml: string | undefined;
    try {
      const pageData = await getPageHtml(session.id);
      pageHtml = pageData.html;
    } catch {}

    const hint = await generateHint({
      challenge,
      targetUrl,
      pageHtml,
      mode: "practice",
      studentMessage: req.body.message,
    });

    res.json({ hint });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sessions/:id/action - Execute a student action in practice mode
router.post("/:id/action", async (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  const { step } = req.body;

  try {
    const { executeSingleStep } = await import("../services/agent-bridge");
    const result = await executeSingleStep(session.id, step, 0);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sessions/:id
router.delete("/:id", async (req, res) => {
  const session = getSession(req.params.id);
  if (session) {
    await closeAgentSession(session.id).catch(() => {});
    deleteSession(session.id);
  }
  res.json({ status: "closed" });
});

export default router;
