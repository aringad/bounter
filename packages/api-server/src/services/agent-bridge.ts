import { AgentStep } from "../types";

const AGENT_URL = process.env.AGENT_URL || "http://ai-agent:6000";

interface StepResult {
  sessionId: string;
  stepIndex: number;
  action: string;
  explanation: string;
  screenshot?: string;
  success: boolean;
  error?: string;
  pageUrl?: string;
  pageTitle?: string;
}

interface TaskResponse {
  sessionId: string;
  results: StepResult[];
  status: string;
  error?: string;
}

export async function executeTask(
  sessionId: string,
  challengeId: string,
  targetUrl: string,
  steps: AgentStep[]
): Promise<TaskResponse> {
  const res = await fetch(`${AGENT_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, challengeId, targetUrl, steps }),
  });

  if (!res.ok) {
    throw new Error(`Agent error: ${res.status} ${await res.text()}`);
  }

  return res.json() as Promise<TaskResponse>;
}

export async function executeSingleStep(
  sessionId: string,
  step: AgentStep,
  stepIndex: number
): Promise<StepResult> {
  const res = await fetch(`${AGENT_URL}/tasks/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, step, stepIndex }),
  });

  if (!res.ok) {
    throw new Error(`Agent error: ${res.status} ${await res.text()}`);
  }

  return res.json() as Promise<StepResult>;
}

export async function getScreenshot(sessionId: string): Promise<string> {
  const res = await fetch(`${AGENT_URL}/tasks/${sessionId}/screenshot`);
  if (!res.ok) throw new Error("Failed to get screenshot");
  const data = await res.json() as { screenshot: string };
  return data.screenshot;
}

export async function getPageHtml(sessionId: string): Promise<{ html: string; url: string; title: string }> {
  const res = await fetch(`${AGENT_URL}/tasks/${sessionId}/html`);
  if (!res.ok) throw new Error("Failed to get page HTML");
  return res.json() as Promise<{ html: string; url: string; title: string }>;
}

export async function closeAgentSession(sessionId: string): Promise<void> {
  await fetch(`${AGENT_URL}/tasks/${sessionId}`, { method: "DELETE" });
}
