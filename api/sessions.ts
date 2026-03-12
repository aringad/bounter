import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated } from "./_auth";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface DemoStep {
  step: number;
  action: string;
  target?: string;
  value?: string;
  explanation: string;
  whatToObserve: string;
}

const SYSTEM_PROMPT = `You are Bounter, an AI security instructor that teaches web vulnerabilities to students.
You demonstrate OWASP Top 10 attacks on purpose-built vulnerable applications (educational only).

When asked to demo a vulnerability, respond with a JSON array of 5-8 steps.
Each step must have:
- step: step number
- action: what to do ("navigate", "type", "click", "observe")
- target: CSS selector or description of where to act
- value: what to type (if action is "type")
- explanation: 2-3 sentence educational explanation for the student
- whatToObserve: what the student should look at on the page

IMPORTANT: Respond ONLY with the JSON array, no markdown, no code fences.`;

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + prompt }] },
      ],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${error}`);
  }

  const data = await res.json() as any;
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function parseSteps(text: string): DemoStep[] {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Could not parse steps");
  return JSON.parse(jsonMatch[0]);
}

async function generateHint(challengeId: string, message?: string): Promise<string> {
  const prompt = `The student is working on the "${challengeId}" challenge in Bounter (a purpose-built vulnerable web app for education).
They said: "${message || "I need a hint"}"
Give a helpful hint without revealing the full answer. Be encouraging. 2-3 sentences max.`;

  return callGemini(prompt);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  // POST /api/sessions — start demo
  if (req.method === "POST" && !req.query.action) {
    const { challengeId, mode = "demo" } = req.body;
    const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);

    if (mode === "demo") {
      try {
        const prompt = `Demonstrate the "${challengeId}" vulnerability step by step.
The vulnerable app is at /vuln/${challengeId} (relative URL, student will see it in an iframe).
Show the exact inputs to type and buttons to click to exploit the vulnerability.`;

        const text = await callGemini(prompt);
        const steps = parseSteps(text);

        return res.json({
          session: { id: sessionId, challengeId, mode, status: "completed" },
          steps: steps.map((s, i) => ({
            sessionId,
            stepIndex: i,
            action: s.action,
            explanation: s.explanation,
            whatToObserve: s.whatToObserve,
            target: s.target,
            value: s.value,
            success: true,
          })),
          status: "completed",
        });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    // Practice mode
    return res.json({
      session: { id: sessionId, challengeId, mode, status: "active" },
      steps: [],
      status: "ready",
    });
  }

  // POST /api/sessions?action=hint
  if (req.method === "POST" && req.query.action === "hint") {
    try {
      const { challengeId, message } = req.body;
      const hint = await generateHint(challengeId, message);
      return res.json({ hint });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
