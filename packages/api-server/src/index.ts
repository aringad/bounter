import express from "express";
import cors from "cors";
import http from "http";
import challengesRouter from "./routes/challenges";
import sessionsRouter from "./routes/sessions";
import healthRouter from "./routes/health";
import { setupWebSocket } from "./ws/handler";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/challenges", challengesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/health", healthRouter);

// Create HTTP server and attach WebSocket
const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Bounter API Server running on http://0.0.0.0:${PORT}`);
  console.log(`WebSocket available at ws://0.0.0.0:${PORT}/ws`);
});
