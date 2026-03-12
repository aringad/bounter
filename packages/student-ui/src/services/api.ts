import { Challenge, SessionResponse } from "../types";

const API_BASE = "/api";

async function authFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, init);
  if (res.status === 401) {
    window.location.href = "/api/login";
    throw new Error("Not authenticated");
  }
  return res;
}

export async function fetchChallenges(): Promise<Challenge[]> {
  const res = await authFetch(`${API_BASE}/challenges`);
  if (!res.ok) throw new Error("Failed to fetch challenges");
  return res.json();
}

export async function startSession(
  challengeId: string,
  mode: "demo" | "practice" = "demo"
): Promise<SessionResponse> {
  const res = await authFetch(`${API_BASE}/sessions`, {
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
  const res = await authFetch(`${API_BASE}/sessions?action=hint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId, message }),
  });
  if (!res.ok) throw new Error("Failed to get hint");
  const data = await res.json();
  return data.hint;
}
