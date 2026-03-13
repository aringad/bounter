import type { VercelRequest, VercelResponse } from "@vercel/node";

import xssHandler from "../../lib/vuln/xss";
import sqliHandler from "../../lib/vuln/sqli";
import csrfHandler from "../../lib/vuln/csrf";
import cmdiHandler from "../../lib/vuln/cmdi";
import idorHandler from "../../lib/vuln/idor";
import brokenAuthHandler from "../../lib/vuln/broken-auth";
import pathTraversalHandler from "../../lib/vuln/path-traversal";
import phishingHandler from "../../lib/vuln/phishing";
import senderHandler from "../../lib/vuln/sender";
import passwordsHandler from "../../lib/vuln/passwords";
import suspiciousUrlsHandler from "../../lib/vuln/suspicious-urls";
import socialEngineeringHandler from "../../lib/vuln/social-engineering";
import permissionsHandler from "../../lib/vuln/permissions";
import publicWifiHandler from "../../lib/vuln/public-wifi";
import backupHandler from "../../lib/vuln/backup";
import fakeNotificationsHandler from "../../lib/vuln/fake-notifications";
import qrCodesHandler from "../../lib/vuln/qr-codes";

const handlers: Record<string, (req: VercelRequest, res: VercelResponse) => any> = {
  xss: xssHandler,
  sqli: sqliHandler,
  csrf: csrfHandler,
  cmdi: cmdiHandler,
  idor: idorHandler,
  "broken-auth": brokenAuthHandler,
  "path-traversal": pathTraversalHandler,
  phishing: phishingHandler,
  sender: senderHandler,
  passwords: passwordsHandler,
  "suspicious-urls": suspiciousUrlsHandler,
  "social-engineering": socialEngineeringHandler,
  permissions: permissionsHandler,
  "public-wifi": publicWifiHandler,
  backup: backupHandler,
  "fake-notifications": fakeNotificationsHandler,
  "qr-codes": qrCodesHandler,
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug as string;
  const routeHandler = handlers[slug];

  if (!routeHandler) {
    return res.status(404).json({ error: "Challenge not found" });
  }

  return routeHandler(req, res);
}
