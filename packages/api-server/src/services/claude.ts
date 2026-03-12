import Anthropic from "@anthropic-ai/sdk";
import { AgentStep, Challenge } from "../types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Bounter, an AI security instructor that demonstrates web vulnerabilities to students.
You interact with a browser to show how common web attacks work on purpose-built vulnerable applications.

IMPORTANT RULES:
- You are ONLY allowed to interact with the Bounter vulnerable apps (internal Docker network)
- Every action you plan must include a clear educational explanation
- Explain both WHAT you're doing and WHY it works
- After demonstrating an attack, briefly explain how to defend against it

When given a challenge, respond with a JSON array of steps to execute in the browser.
Each step must have:
- action: "navigate" | "click" | "type" | "screenshot" | "wait"
- explanation: A clear explanation for the student (2-3 sentences)
- Plus action-specific fields (url, selector, value)

For "type" actions, use CSS selectors for the selector field.
For "click" actions, use CSS selectors or text-based selectors.`;

interface ChallengePrompt {
  challenge: Challenge;
  targetUrl: string;
  pageHtml?: string;
  mode: "demo" | "practice";
  studentMessage?: string;
}

export async function generateDemoSteps(prompt: ChallengePrompt): Promise<AgentStep[]> {
  const userMessage = buildUserMessage(prompt);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  return parseSteps(text);
}

export async function generateHint(prompt: ChallengePrompt): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are Bounter, a security instructor helping a student learn about web vulnerabilities.
Give helpful hints without giving away the full answer. Be encouraging and educational.
The student is working on a challenge in a purpose-built vulnerable app (safe, educational context).`,
    messages: [
      {
        role: "user",
        content: `Challenge: ${prompt.challenge.title}
Description: ${prompt.challenge.description}
Target URL: ${prompt.targetUrl}
${prompt.pageHtml ? `Current page HTML (truncated): ${prompt.pageHtml.slice(0, 2000)}` : ""}
Student message: ${prompt.studentMessage || "I need a hint"}`,
      },
    ],
  });

  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

function buildUserMessage(prompt: ChallengePrompt): string {
  let msg = `Demonstrate the "${prompt.challenge.title}" vulnerability.

Challenge details:
- Category: ${prompt.challenge.category}
- Difficulty: ${prompt.challenge.difficulty}
- Description: ${prompt.challenge.description}
- Target URL: ${prompt.targetUrl}
`;

  if (prompt.pageHtml) {
    msg += `\nCurrent page HTML (truncated to 3000 chars):\n${prompt.pageHtml.slice(0, 3000)}\n`;
  }

  msg += `\nProvide your response as a JSON array of steps. Example format:
[
  {"action": "navigate", "url": "${prompt.targetUrl}", "explanation": "First, let's navigate to the vulnerable page..."},
  {"action": "type", "selector": "input[name='username']", "value": "test", "explanation": "We enter a value..."},
  {"action": "click", "selector": "input[type='submit']", "explanation": "Submit the form..."},
  {"action": "screenshot", "explanation": "Let's see the result..."}
]

Include 4-8 steps that clearly demonstrate the vulnerability. Start with navigation and end with a screenshot showing the successful exploit.`;

  return msg;
}

function parseSteps(text: string): AgentStep[] {
  // Extract JSON array from the response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Could not parse steps from Claude response");
  }

  try {
    const steps = JSON.parse(jsonMatch[0]) as AgentStep[];
    return steps.filter(
      (s) => s.action && s.explanation && ["navigate", "click", "type", "screenshot", "wait", "evaluate"].includes(s.action)
    );
  } catch {
    throw new Error("Invalid JSON in Claude response");
  }
}
