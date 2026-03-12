import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isProUser, getGeminiKey } from "./_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isProUser(req)) return res.status(403).json({ error: "Pro access required" });

  if (req.method === "GET") {
    const key = getGeminiKey();
    const hasKey = !!key;
    const masked = hasKey ? key.slice(0, 6) + "..." + key.slice(-4) : "";
    return res.json({ hasKey, masked });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
