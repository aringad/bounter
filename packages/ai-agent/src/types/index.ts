export interface AgentStep {
  action: "navigate" | "click" | "type" | "screenshot" | "wait" | "evaluate";
  selector?: string;
  value?: string;
  url?: string;
  script?: string;
  explanation: string;
}

export interface TaskRequest {
  sessionId: string;
  challengeId: string;
  targetUrl: string;
  steps: AgentStep[];
}

export interface StepResult {
  sessionId: string;
  stepIndex: number;
  action: string;
  explanation: string;
  screenshot?: string; // base64
  success: boolean;
  error?: string;
  pageUrl?: string;
  pageTitle?: string;
}

export interface TaskStatus {
  sessionId: string;
  status: "running" | "completed" | "error";
  currentStep: number;
  totalSteps: number;
}
