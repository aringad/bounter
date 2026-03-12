export interface Challenge {
  id: string;
  title: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  targetPath: string;
}

export interface Session {
  id: string;
  challengeId: string;
  mode: "demo" | "practice";
  status: "active" | "completed" | "error";
  createdAt: Date;
}

export interface AgentStep {
  action: "navigate" | "click" | "type" | "screenshot" | "wait" | "evaluate";
  selector?: string;
  value?: string;
  url?: string;
  script?: string;
  explanation: string;
}

export interface WsMessage {
  type: "step_result" | "status" | "hint" | "error" | "complete";
  data: any;
}
