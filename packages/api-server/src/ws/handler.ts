import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { getSession } from "../services/session-manager";
import { getScreenshot } from "../services/agent-bridge";

const clients = new Map<string, Set<WebSocket>>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      ws.close(1008, "Missing sessionId");
      return;
    }

    const session = getSession(sessionId);
    if (!session) {
      ws.close(1008, "Session not found");
      return;
    }

    // Register client
    if (!clients.has(sessionId)) {
      clients.set(sessionId, new Set());
    }
    clients.get(sessionId)!.add(ws);

    console.log(`WebSocket client connected for session ${sessionId}`);

    ws.on("message", async (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "get_screenshot") {
          const screenshot = await getScreenshot(sessionId);
          ws.send(JSON.stringify({ type: "screenshot", data: { screenshot } }));
        }
      } catch (err: any) {
        ws.send(JSON.stringify({ type: "error", data: { message: err.message } }));
      }
    });

    ws.on("close", () => {
      const sessionClients = clients.get(sessionId);
      if (sessionClients) {
        sessionClients.delete(ws);
        if (sessionClients.size === 0) {
          clients.delete(sessionId);
        }
      }
    });
  });

  return wss;
}

export function broadcastToSession(sessionId: string, message: any) {
  const sessionClients = clients.get(sessionId);
  if (sessionClients) {
    const data = JSON.stringify(message);
    sessionClients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }
}
