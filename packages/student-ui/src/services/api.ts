import { Challenge, SessionResponse } from "../types";
import { Lang } from "../i18n";

const API_BASE = "/api";

async function authFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, init);
  if (res.status === 401) {
    window.location.href = "/api/login";
    throw new Error("Not authenticated");
  }
  if (res.status === 403) {
    throw new Error("Pro access required");
  }
  return res;
}

export async function checkProAccess(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/apikey`);
    return res.status !== 403;
  } catch {
    return false;
  }
}

export async function fetchChallenges(): Promise<Challenge[]> {
  const res = await authFetch(`${API_BASE}/challenges`);
  if (!res.ok) throw new Error("Failed to fetch challenges");
  return res.json();
}

export async function startSession(
  challengeId: string,
  mode: "demo" | "practice" = "demo",
  lang: Lang = "it"
): Promise<SessionResponse> {
  const res = await authFetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId, mode, lang }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to start session");
  }
  return res.json();
}

export async function getHint(challengeId: string, message?: string, lang: Lang = "it"): Promise<string> {
  const res = await authFetch(`${API_BASE}/sessions?action=hint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId, message, lang }),
  });
  if (!res.ok) throw new Error("Failed to get hint");
  const data = await res.json();
  return data.hint;
}
