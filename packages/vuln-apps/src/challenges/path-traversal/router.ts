import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = Router();

// Simulated file storage
const SAFE_DIR = path.join(__dirname, "files");

// GET /challenges/path-traversal
router.get("/", (req: Request, res: Response) => {
  res.render("challenges/path-traversal/views/index", {
    title: "Path Traversal Challenge",
    content: null,
    filename: null,
    error: null,
  });
});

// GET /challenges/path-traversal/download
// VULNERABLE: No path sanitization, allows directory traversal
router.get("/download", (req: Request, res: Response) => {
  const filename = req.query.file as string;

  if (!filename) {
    return res.render("challenges/path-traversal/views/index", {
      title: "Path Traversal Challenge",
      content: null,
      filename: null,
      error: "No file specified.",
    });
  }

  // VULNERABLE: path.join does not prevent traversal with ../
  const filePath = path.join(SAFE_DIR, filename);

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    res.render("challenges/path-traversal/views/index", {
      title: "Path Traversal Challenge",
      content,
      filename,
      error: null,
    });
  } catch (err: any) {
    res.render("challenges/path-traversal/views/index", {
      title: "Path Traversal Challenge",
      content: null,
      filename,
      error: `Could not read file: ${err.message}`,
    });
  }
});

export default router;
