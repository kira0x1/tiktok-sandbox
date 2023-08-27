import clc from 'cli-color'
import Database from 'better-sqlite3'
import { dbPath } from '../util'
import * as Types from '../types'

const cookieStatement = `(name, value, domain, hostOnly, path, secure, httpOnly, session, expirationDate, sameSite) VALUES (?,?,?,?,?,?,?,?,?,?)`

export class DatabaseManager {
  public static db: Database.Database

  constructor() {
    const db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    if (process.argv.includes('--initdb')) DatabaseManager.initTables(db)
    DatabaseManager.db = db
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
    )`)

    const sessionStmt = db.prepare(`CREATE TABLE IF NOT EXISTS session_cookies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      value TEXT,
      domain TEXT,
      hostOnly INTEGER,
      path TEXT,
      secure INTEGER,
      httpOnly INTEGER,
      session INTEGER,
      expirationDate REAL,
      sameSite TEXT
  )`)

    const info = stmt.run()
    const sessionInfo = sessionStmt.run()

    console.log(clc.bold('Creating ' + clc.magenta('known_cookies') + ' table'))

    process.stdout.write(
      clc.columns([
        [clc.bold('Changes'), clc.bold('Last Insert Row')],
        [clc.magenta.bold(info.changes), clc.magenta.bold(info.lastInsertRowid)]
      ])
    )

    console.log(clc.bold('\nCreating ' + clc.magenta('session_cookies') + ' table'))

    process.stdout.write(
      clc.columns([
        [clc.bold('Changes'), clc.bold('Last Insert Row')],
        [clc.magenta.bold(sessionInfo.changes), clc.magenta.bold(sessionInfo.lastInsertRowid)]
      ])
    )
  }

  public static importCookies(cookies: Array<Types.Cookie>) {
    for (const cookie of cookies) {
      DatabaseManager.importCookie(cookie)
    }
  }

  public static importCookie(cookie: Types.Cookie) {
    const db = DatabaseManager.db

    const stmt = db.prepare(`INSERT INTO known_cookies ${cookieStatement}`)

    const parsedCookie = Types.CookieSchema.parse(cookie)

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
      )
      console.log(info)
    } catch (e) {
      /* empty */
    }
  }

  public static getKnownCookies(): Types.Cookie[] {
    const db = DatabaseManager.db
    const stmt = db.prepare(`SELECT * FROM known_cookies`)
    const res = stmt.all()
    const formattedRes: Types.Cookie[] = []
    res.map((c) => {
      const parsedCookie = Types.CookieSchema.parse(c)
      if (parsedCookie) formattedRes.push(parsedCookie)
    })

    return formattedRes
  }
}

export function initDB() {
  const dbManager = new DatabaseManager()
}
