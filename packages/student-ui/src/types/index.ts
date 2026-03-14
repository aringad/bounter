export interface Challenge {
  id: string;
  title: string;
  category: string;
  difficulty: "beginner" | "easy" | "medium" | "hard";
  description: string;
  targetPath: string;
  type: "general" | "networking" | "dns" | "tcp-udp" | "technical";
}

export interface StepResult {
  sessionId: string;
  stepIndex: number;
  action: string;
  explanation: string;
  whatToObserve?: string;
  target?: string;
  value?: string;
  success: boolean;
}

export interface Session {
  id: string;
  challengeId: string;
  mode: "demo" | "practice";
  status: string;
}

export interface SessionResponse {
  session: Session;
  steps: StepResult[];
  status: string;
}
