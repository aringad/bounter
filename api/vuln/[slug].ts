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
// Networking: LAN & Infrastructure
import netDevicesHandler from "../../lib/vuln/net-devices";
import netCablingHandler from "../../lib/vuln/net-cabling";
import netSubnettingHandler from "../../lib/vuln/net-subnetting";
import netVlanHandler from "../../lib/vuln/net-vlan";
import netDhcpHandler from "../../lib/vuln/net-dhcp";
import netNatHandler from "../../lib/vuln/net-nat";
// Networking: DNS
import dnsResolutionHandler from "../../lib/vuln/dns-resolution";
import dnsRecordsHandler from "../../lib/vuln/dns-records";
import dnsDigHandler from "../../lib/vuln/dns-dig";
import dnsEmailAuthHandler from "../../lib/vuln/dns-email-auth";
import dnsAttacksHandler from "../../lib/vuln/dns-attacks";
import dnsTroubleshootingHandler from "../../lib/vuln/dns-troubleshooting";
// Networking: TCP, UDP & Ports
import tcpHandshakeHandler from "../../lib/vuln/tcp-handshake";
import tcpVsUdpHandler from "../../lib/vuln/tcp-vs-udp";
import tcpPortsHandler from "../../lib/vuln/tcp-ports";
import tcpSegmentHandler from "../../lib/vuln/tcp-segment";
import tcpFirewallHandler from "../../lib/vuln/tcp-firewall";
import tcpNetstatHandler from "../../lib/vuln/tcp-netstat";

// Switch e LAN Avanzate
import swMacTableHandler from "../../lib/vuln/sw-mac-table";
import swVlanTrunkHandler from "../../lib/vuln/sw-vlan-trunk";
import swStpLagHandler from "../../lib/vuln/sw-stp-lag";
import swSecurityHandler from "../../lib/vuln/sw-security";
// AI
import aiLlmHandler from "../../lib/vuln/ai-llm";
import aiPromptHandler from "../../lib/vuln/ai-prompt";
import aiModelsHandler from "../../lib/vuln/ai-models";
import aiDeepfakeHandler from "../../lib/vuln/ai-deepfake";
import aiPrivacyHandler from "../../lib/vuln/ai-privacy";
import aiToolsHandler from "../../lib/vuln/ai-tools";

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
  // LAN & Infrastructure
  "net-devices": netDevicesHandler,
  "net-cabling": netCablingHandler,
  "net-subnetting": netSubnettingHandler,
  "net-vlan": netVlanHandler,
  "net-dhcp": netDhcpHandler,
  "net-nat": netNatHandler,
  // DNS
  "dns-resolution": dnsResolutionHandler,
  "dns-records": dnsRecordsHandler,
  "dns-dig": dnsDigHandler,
  "dns-email-auth": dnsEmailAuthHandler,
  "dns-attacks": dnsAttacksHandler,
  "dns-troubleshooting": dnsTroubleshootingHandler,
  // Switch e LAN Avanzate
  "sw-mac-table": swMacTableHandler,
  "sw-vlan-trunk": swVlanTrunkHandler,
  "sw-stp-lag": swStpLagHandler,
  "sw-security": swSecurityHandler,
  // AI
  "ai-llm": aiLlmHandler,
  "ai-prompt": aiPromptHandler,
  "ai-models": aiModelsHandler,
  "ai-deepfake": aiDeepfakeHandler,
  "ai-privacy": aiPrivacyHandler,
  "ai-tools": aiToolsHandler,
  // TCP, UDP & Ports
  "tcp-handshake": tcpHandshakeHandler,
  "tcp-vs-udp": tcpVsUdpHandler,
  "tcp-ports": tcpPortsHandler,
  "tcp-segment": tcpSegmentHandler,
  "tcp-firewall": tcpFirewallHandler,
  "tcp-netstat": tcpNetstatHandler,
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug as string;
  const routeHandler = handlers[slug];

  if (!routeHandler) {
    return res.status(404).json({ error: "Challenge not found" });
  }

  return routeHandler(req, res);
}
