import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyPassword, getAuthCookieHeader, sendLoginPage } from "./_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return sendLoginPage(res);
  }

  if (req.method === "POST") {
    const password = String(req.body?.password || "");

    if (verifyPassword(password)) {
      res.setHeader("Set-Cookie", getAuthCookieHeader());
      res.writeHead(302, { Location: "/" });
      return res.end();
    }

    return sendLoginPage(res, "Wrong password.");
  }

  return res.status(405).end();
}
