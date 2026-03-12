import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../_auth";
import { wrapLayout } from "./_layout";

// Simulated command injection (can't run real commands on Vercel)
function simulatePing(host: string): { output: string; injected: boolean } {
  // Check for command injection patterns
  const separators = [";", "&&", "||", "|", "$(", "`"];
  const hasInjection = separators.some((s) => host.includes(s));

  if (hasInjection) {
    // Extract the injected command
    let injectedCmd = "";
    for (const sep of separators) {
      if (host.includes(sep)) {
        const parts = host.split(sep);
        injectedCmd = parts.slice(1).join(sep).trim();
        if (sep === "$(") injectedCmd = injectedCmd.replace(")", "");
        if (sep === "`") injectedCmd = injectedCmd.replace("`", "");
        break;
      }
    }

    const pingOutput = `PING 127.0.0.1 (127.0.0.1): 56 data bytes\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.063 ms\n`;

    // Simulate common commands
    const cmdOutputs: Record<string, string> = {
      whoami: "www-data",
      id: "uid=33(www-data) gid=33(www-data) groups=33(www-data)",
      "cat /etc/passwd": "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin",
      ls: "index.ts\npackage.json\nnode_modules\nflag.txt",
      "ls -la": "total 32\ndrwxr-xr-x 4 www-data www-data 4096 Jan 15 10:30 .\n-rw-r--r-- 1 www-data www-data  256 Jan 15 10:30 index.ts\n-rw-r--r-- 1 www-data www-data   42 Jan 15 10:30 flag.txt",
      "cat flag.txt": "FLAG{command_injection_success}",
      pwd: "/app",
      uname: "Linux",
      "uname -a": "Linux bounter-vuln 5.15.0 #1 SMP x86_64 GNU/Linux",
      env: "NODE_ENV=production\nHOSTNAME=bounter-vuln\nPATH=/usr/local/bin:/usr/bin:/bin",
    };

    const cmdLower = injectedCmd.toLowerCase().trim();
    const cmdOutput = cmdOutputs[cmdLower] || `sh: command not found: ${injectedCmd}`;

    return { output: pingOutput + cmdOutput, injected: true };
  }

  // Normal ping simulation
  if (host === "127.0.0.1" || host === "localhost") {
    return {
      output: `PING ${host} (127.0.0.1): 56 data bytes\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.063 ms\n\n--- ${host} ping statistics ---\n2 packets transmitted, 2 packets received, 0% packet loss`,
      injected: false,
    };
  }

  return {
    output: `PING ${host}: 56 data bytes\n64 bytes from ${host}: icmp_seq=0 ttl=52 time=14.2 ms\n64 bytes from ${host}: icmp_seq=1 ttl=52 time=13.8 ms\n\n--- ${host} ping statistics ---\n2 packets transmitted, 2 packets received, 0% packet loss`,
    injected: false,
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  let output = "";
  let hostValue = "";

  if (req.method === "POST") {
    hostValue = String(req.body?.host || "");
    if (hostValue) {
      const result = simulatePing(hostValue);
      output = `<div class="card"><h3>Output ${result.injected ? '<span class="badge" style="background:#22c55e">EXPLOITED!</span>' : ""}</h3>
        <pre>${result.output}</pre>
        <p style="margin-top:0.5rem;color:#64748b;font-size:0.8rem">Server executed: <code>ping -c 2 ${hostValue.replace(/</g, "&lt;")}</code></p>
      </div>`;
    }
  }

  const html = wrapLayout(
    "Command Injection",
    `<h2>Command Injection <span class="badge">Challenge</span></h2>
    <div class="card">
      <p style="color:#94a3b8;margin-bottom:0.75rem">This network utility runs a ping command on the server. Can you inject additional commands?</p>
      <h3>Ping Utility</h3>
      <form method="POST" action="/vuln/cmdi">
        <input type="text" name="host" placeholder="Enter hostname or IP (e.g. 127.0.0.1)" value="${hostValue.replace(/"/g, "&quot;")}" required>
        <input type="submit" value="Ping">
      </form>
    </div>
    ${output}
    <div class="card">
      <h3>Hints</h3>
      <details><summary>Hint 1</summary><p style="margin-top:0.3rem;color:#94a3b8">The server runs: <code>ping -c 2 [your input]</code></p></details>
      <details><summary>Hint 2</summary><p style="margin-top:0.3rem;color:#94a3b8">Shell metacharacters like <code>;</code> <code>&&</code> <code>|</code> can chain commands.</p></details>
      <details><summary>Hint 3</summary><p style="margin-top:0.3rem;color:#94a3b8">Try: <code>127.0.0.1; whoami</code></p></details>
    </div>`
  );

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
