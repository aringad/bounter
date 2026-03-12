import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated } from "./_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const key = String(req.body?.key || "").trim();
    if (!key) return res.status(400).json({ error: "Missing API key" });

    // Save the key in a cookie (not HttpOnly so JS can read it for display, but the actual value is only used server-side)
    res.setHeader("Set-Cookie", `gemini_key=${encodeURIComponent(key)}; Path=/; SameSite=Lax; Max-Age=86400`);
    return res.json({ status: "saved" });
  }

  if (req.method === "GET") {
    const cookie = req.headers.cookie || "";
    const match = cookie.match(/gemini_key=([^;]+)/);
    const hasKey = !!match;
    // Don't expose the full key, just whether it's set and a masked version
    let masked = "";
    if (match) {
      try {
        const key = decodeURIComponent(match[1]);
        masked = key.slice(0, 6) + "..." + key.slice(-4);
      } catch {}
    }
    return res.json({ hasKey, masked });
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", "gemini_key=; Path=/; Max-Age=0");
    return res.json({ status: "removed" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
