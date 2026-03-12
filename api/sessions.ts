import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isProUser, getGeminiKey } from "./_auth";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

interface DemoStep {
  step: number;
  action: string;
  target?: string;
  value?: string;
  explanation: string;
  whatToObserve: string;
}

function getSystemPrompt(lang: string): string {
  const langInstruction = lang === "it"
    ? "IMPORTANT: Write ALL explanation and whatToObserve fields in Italian."
    : "Write all explanation and whatToObserve fields in English.";

  return `You are Bounter, an AI security instructor that teaches web vulnerabilities to students.
You demonstrate OWASP Top 10 attacks on purpose-built vulnerable applications (educational only).

When asked to demo a vulnerability, respond with a JSON array of 5-8 steps.
Each step must have:
- step: step number
- action: what to do ("navigate", "type", "click", "observe")
- target: CSS selector or description of where to act
- value: what to type (if action is "type")
- explanation: 2-3 sentence educational explanation for the student
- whatToObserve: what the student should look at on the page

${langInstruction}

IMPORTANT: Respond ONLY with the JSON array, no markdown, no code fences.`;
}

async function callGemini(apiKey: string, prompt: string, lang: string): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: getSystemPrompt(lang) + "\n\n" + prompt }] },
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

async function generateHint(apiKey: string, challengeId: string, message?: string, lang?: string): Promise<string> {
  const langNote = lang === "it" ? "Rispondi in italiano." : "Respond in English.";
  const prompt = `The student is working on the "${challengeId}" challenge in Bounter (a purpose-built vulnerable web app for education).
They said: "${message || (lang === "it" ? "Ho bisogno di un suggerimento" : "I need a hint")}"
Give a helpful hint without revealing the full answer. Be encouraging. 2-3 sentences max.
${langNote}`;

  return callGemini(apiKey, prompt, lang || "en");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (!isProUser(req)) return res.status(403).json({ error: "Pro access required" });

  const geminiKey = getGeminiKey();

  if (!geminiKey) {
    return res.status(400).json({ error: "Gemini API key not configured. Add your key in Settings." });
  }

  // POST /api/sessions — start demo
  if (req.method === "POST" && !req.query.action) {
    const { challengeId, mode = "demo", lang = "en" } = req.body;
    const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);

    if (mode === "demo") {
      try {
        const prompt = `Demonstrate the "${challengeId}" vulnerability step by step.
The vulnerable app is at /vuln/${challengeId} (relative URL, student will see it in an iframe).
Show the exact inputs to type and buttons to click to exploit the vulnerability.`;

        const text = await callGemini(geminiKey, prompt, lang);
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
      const { challengeId, message, lang = "en" } = req.body;
      const hint = await generateHint(geminiKey, challengeId, message, lang);
      return res.json({ hint });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
