import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyPassword, getAuthCookieHeader, sendLoginPage } from "./_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return sendLoginPage(res);
  }

  if (req.method === "POST") {
    const password = String(req.body?.password || "");
    const result = verifyPassword(password);

    if (result.valid) {
      res.setHeader("Set-Cookie", getAuthCookieHeader(result.tier));
      res.writeHead(302, { Location: "/" });
      return res.end();
    }

    return sendLoginPage(res, "Password non valida.");
  }

  return res.status(405).end();
}
