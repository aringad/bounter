import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(__dirname, "..", "..", "bounter.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    -- Users table for SQLi and auth challenges
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      email TEXT,
      balance REAL DEFAULT 100.00
    );

    -- Posts table for XSS challenges
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Files table for path traversal
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      content TEXT NOT NULL,
      owner TEXT NOT NULL
    );
  `);

  // Seed data
  const userCount = db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number };
  if (userCount.c === 0) {
    const insertUser = db.prepare(
      "INSERT INTO users (username, password, role, email, balance) VALUES (?, ?, ?, ?, ?)"
    );
    insertUser.run("admin", "supersecretpassword", "admin", "admin@bounter.local", 10000);
    insertUser.run("alice", "password123", "user", "alice@bounter.local", 500);
    insertUser.run("bob", "bobpass", "user", "bob@bounter.local", 250);
    insertUser.run("charlie", "charlie1", "user", "charlie@bounter.local", 750);

    const insertPost = db.prepare(
      "INSERT INTO posts (author, content) VALUES (?, ?)"
    );
    insertPost.run("alice", "Welcome to the Bounter forum!");
    insertPost.run("bob", "Has anyone tried the new features?");
    insertPost.run("admin", "Please report any security issues.");

    const insertFile = db.prepare(
      "INSERT INTO files (filename, content, owner) VALUES (?, ?, ?)"
    );
    insertFile.run("report.txt", "Q4 Sales Report: Revenue up 15%", "alice");
    insertFile.run("notes.txt", "Meeting notes from Monday standup", "bob");
    insertFile.run("secret.txt", "FLAG{path_traversal_success}", "admin");
  }
}
