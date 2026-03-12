import express from "express";
import { BrowserContext, Page } from "playwright";
import { createSession, closeSession } from "./browser";
import { executeStep } from "./executor";
import { TaskRequest, StepResult, TaskStatus } from "./types";

const app = express();
const PORT = 6000;

app.use(express.json({ limit: "10mb" }));

// Active sessions
const sessions = new Map<string, { context: BrowserContext; page: Page }>();

// POST /tasks - Execute a sequence of browser actions
app.post("/tasks", async (req, res) => {
  const task: TaskRequest = req.body;
  const { sessionId, steps, targetUrl } = task;

  try {
    // Create or reuse session
    let session = sessions.get(sessionId);
    if (!session) {
      session = await createSession();
      sessions.set(sessionId, session);
    }

    const results: StepResult[] = [];

    for (let i = 0; i < steps.length; i++) {
      const result = await executeStep(session.page, steps[i], i, sessionId);
      results.push(result);

      // If a step failed, stop execution
      if (!result.success) break;
    }

    res.json({ sessionId, results, status: "completed" });
  } catch (err: any) {
    res.status(500).json({ sessionId, error: err.message, status: "error" });
  }
});

// POST /tasks/step - Execute a single step on an existing session
app.post("/tasks/step", async (req, res) => {
  const { sessionId, step, stepIndex } = req.body;

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  try {
    const result = await executeStep(session.page, step, stepIndex, sessionId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /tasks/:sessionId/screenshot - Get current screenshot
app.get("/tasks/:sessionId/screenshot", async (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  try {
    const { takeScreenshot } = await import("./browser");
    const screenshot = await takeScreenshot(session.page);
    res.json({ screenshot });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /tasks/:sessionId/html - Get current page HTML
app.get("/tasks/:sessionId/html", async (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  try {
    const html = await session.page.content();
    res.json({ html, url: session.page.url(), title: await session.page.title() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:sessionId - Close a session
app.delete("/tasks/:sessionId", async (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (session) {
    await closeSession(session.context);
    sessions.delete(req.params.sessionId);
  }
  res.json({ status: "closed" });
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", sessions: sessions.size }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Bounter AI Agent running on http://0.0.0.0:${PORT}`);
});
