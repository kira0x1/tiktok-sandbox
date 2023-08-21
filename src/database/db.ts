import Database from "better-sqlite3";
import { dbPath } from "../util";

export class DatabaseManager {
  public static db: Database.Database;

  constructor() {
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    DatabaseManager.initTables(db);
    DatabaseManager.db = db;
  }

  private static initTables(db: Database.Database) {
    const stmt = db.prepare(`CREATE TABLE IF NOT EXISTS known_cookies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        session BOOLEAN,
        httpOnly BOOLEAN,
        secure BOOLEAN,
        hostOnly BOOLEAN,
        path TEXT,
        domain TEXT,
        value TEXT,
        sameSite TEXT,
        experationDate REAL
    )`);

    const info = stmt.run();

    console.log(`changes: ${info.changes}`);
  }
}

export function initDB() {
  const dbManager = new DatabaseManager();
}
