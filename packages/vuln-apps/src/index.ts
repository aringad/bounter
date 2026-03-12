import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { getDb } from "./db/init";

// Challenge routers
import xssRouter from "./challenges/xss/router";
import sqliRouter from "./challenges/sqli/router";
import csrfRouter from "./challenges/csrf/router";
import cmdiRouter from "./challenges/cmdi/router";
import pathTraversalRouter from "./challenges/path-traversal/router";
import idorRouter from "./challenges/idor/router";
import brokenAuthRouter from "./challenges/broken-auth/router";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname));

// Layout middleware - wraps all renders with layout
app.use((req, res, next) => {
  const originalRender = res.render.bind(res);
  res.render = function (view: string, options?: any, callback?: any) {
    const opts = options || {};
    req.app.render(view, opts, (err: Error | null, body: string) => {
      if (err) {
        if (callback) return callback(err);
        return res.status(500).send("Render error: " + err.message);
      }
      originalRender("shared/layout", { ...opts, body, title: opts.title || "Bounter" } as any, callback);
    });
  } as any;
  next();
});

// Initialize database
getDb();

// Routes
app.get("/", (req, res) => res.redirect("/challenges"));
app.get("/challenges", (req, res) => {
  res.render("challenges/index", { title: "Challenges" });
});

app.use("/challenges/xss", xssRouter);
app.use("/challenges/sqli", sqliRouter);
app.use("/challenges/csrf", csrfRouter);
app.use("/challenges/cmdi", cmdiRouter);
app.use("/challenges/path-traversal", pathTraversalRouter);
app.use("/challenges/idor", idorRouter);
app.use("/challenges/broken-auth", brokenAuthRouter);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Bounter Vulnerable Apps running on http://0.0.0.0:${PORT}`);
  console.log("WARNING: This app is intentionally vulnerable. For educational use only!");
});
