import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, getGeminiKey } from "./_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const key = getGeminiKey();
    const hasKey = !!key;
    const masked = hasKey ? key.slice(0, 6) + "..." + key.slice(-4) : "";
    return res.json({ hasKey, masked });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
