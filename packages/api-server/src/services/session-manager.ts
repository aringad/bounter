import { v4 as uuidv4 } from "uuid";
import { Session } from "../types";

const sessions = new Map<string, Session>();

export function createSession(challengeId: string, mode: "demo" | "practice"): Session {
  const session: Session = {
    id: uuidv4(),
    challengeId,
    mode,
    status: "active",
    createdAt: new Date(),
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, updates: Partial<Session>): void {
  const session = sessions.get(id);
  if (session) {
    Object.assign(session, updates);
  }
}

export function deleteSession(id: string): void {
  sessions.delete(id);
}

export function listSessions(): Session[] {
  return Array.from(sessions.values());
}
