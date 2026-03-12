import { Challenge, SessionResponse } from "../types";

const API_BASE = "/api";

export async function fetchChallenges(): Promise<Challenge[]> {
  const res = await fetch(`${API_BASE}/challenges`);
  if (!res.ok) throw new Error("Failed to fetch challenges");
  return res.json();
}

export async function startSession(
  challengeId: string,
  mode: "demo" | "practice" = "demo"
): Promise<SessionResponse> {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId, mode }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to start session");
  }
  return res.json();
}

export async function getHint(challengeId: string, message?: string): Promise<string> {
  const res = await fetch(`${API_BASE}/sessions?action=hint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId, message }),
  });
  if (!res.ok) throw new Error("Failed to get hint");
  const data = await res.json();
  return data.hint;
}
