import fs from 'fs'
import path from 'path'
import * as Types from './types'
import { DatabaseManager, initDB } from './database'

// ---- PATHS ----
export const dataPath = path.join(__dirname, '../../data')
export const cookiesPath = path.join(dataPath, 'cookies.json')
export const dbPath = path.join(dataPath, 'tiktokdb.sqlite')

// ---- USER AGENT ----
const userAgents = {
  linux:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.4 (KHTML like Gecko) Chrome/93.0.4542.2 Safari/537.36',
  win32:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  darwin:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/93.0.4542.2 Safari/537.36'
}

export const userAgent: string = userAgents[process.platform] || userAgents['win32']

// ---- COOKIES ----
export async function saveCookies(cookies: Map<string, Electron.Cookie>) {
  console.log(`saving cookies to ${cookiesPath}`)

  const data = JSON.stringify(Array.from(cookies.values()))
  fs.writeFileSync(cookiesPath, data)
  console.log('cookies saved...')
}

// Reads cookies from the cookies.json file
export function readCookies(): Array<Types.Cookie> {
  const cookiesFile = fs.readFileSync(cookiesPath).toString()
  const cookiesData = JSON.parse(cookiesFile)

  try {
    const parsedCookies = Types.CookiesArraySchema.parse(cookiesData)
    return parsedCookies
  } catch (e) {
    console.error(e)
    return []
  }
}

// ---- MATH ----
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() + (max - min + 1)) + min
}

// ---- FLAGS ----
export async function checkFlags() {
  if (process.argv.includes('--initdb')) {
    // Initalize Database and Create tables
    initDB()
  }

  // Import cookies from file
  if (process.argv.includes('--importcookies')) {
    console.log(`inserting cookie into db`)
    const cookies = readCookies()
    if (cookies) DatabaseManager.importCookies(cookies)
  }

  // Print cookies to console
  if (process.argv.includes('--showall')) {
    console.log(`getting all`)
    DatabaseManager.getKnownCookies()
  }
}
