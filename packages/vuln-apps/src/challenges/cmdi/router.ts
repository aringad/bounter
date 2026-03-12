import { Router, Request, Response } from "express";
import { execSync } from "child_process";

const router = Router();

// GET /challenges/cmdi
router.get("/", (req: Request, res: Response) => {
  res.render("challenges/cmdi/views/index", {
    title: "Command Injection Challenge",
    output: null,
    host: null,
  });
});

// POST /challenges/cmdi/ping
// VULNERABLE: User input passed directly to shell command
router.post("/ping", (req: Request, res: Response) => {
  const { host } = req.body;

  try {
    // VULNERABLE: Direct command injection - no input sanitization
    const output = execSync(`ping -c 2 ${host}`, {
      timeout: 5000,
      encoding: "utf-8",
    });

    res.render("challenges/cmdi/views/index", {
      title: "Command Injection Challenge",
      output,
      host,
    });
  } catch (err: any) {
    res.render("challenges/cmdi/views/index", {
      title: "Command Injection Challenge",
      output: err.stderr || err.stdout || err.message,
      host,
    });
  }
});

export default router;
