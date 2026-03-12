import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Set-Cookie", "bounter_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  res.writeHead(302, { Location: "/api/login" });
  return res.end();
}
