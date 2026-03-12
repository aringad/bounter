export interface Challenge {
  id: string;
  title: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  targetPath: string;
}

export interface StepResult {
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
