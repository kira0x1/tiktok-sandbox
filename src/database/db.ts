import Database from "better-sqlite3";
import { dbPath } from "../util";
import * as Types from "../types";

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
        value TEXT,
        domain TEXT,
        hostOnly INTEGER,
        path TEXT,
        secure INTEGER ,
        httpOnly INTEGER,
        session INTEGER,
        expirationDate REAL,
        sameSite TEXT
    )`);

    const info = stmt.run();
    console.log(`changes: ${info.changes}`);
  }

  public static importCookies(cookies: Array<Types.Cookie>) {
    for (const cookie of cookies) {
      DatabaseManager.importCookie(cookie);
    }
  }

  public static importCookie(cookie: Types.Cookie) {
    const db = DatabaseManager.db;

    const stmt = db.prepare(
      `INSERT INTO known_cookies (name, value, domain, hostOnly, path, secure, httpOnly, session, expirationDate, sameSite) VALUES (?,?,?,?,?,?,?,?,?,?)`
    );

    const parsedCookie = Types.CookieSchema.parse(cookie);

    try {
      const info = stmt.run(
        parsedCookie.name,
        parsedCookie.value,
        parsedCookie.domain,
        Number(parsedCookie.hostOnly),
        parsedCookie.path,
        Number(parsedCookie.secure),
        Number(parsedCookie.httpOnly),
        Number(parsedCookie.session),
        parsedCookie.expirationDate,
        parsedCookie.sameSite
      );
      console.log(info);
    } catch (e) {}
  }

  public static getKnownCookies() {
    const db = DatabaseManager.db;
    const stmt = db.prepare(`SELECT * FROM known_cookies`);
    const res = stmt.all();
    console.log(res);
  }
}

export function initDB() {
  const dbManager = new DatabaseManager();
}
