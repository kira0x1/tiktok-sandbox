import fs from "fs";
import path from "path";

// ---- PATHS ----
export const publicPath = path.join(__dirname, "../public");
export const dataPath = path.join(__dirname, "../data");
export const cookiesPath = path.join(dataPath, "cookies.json");

// ---- USER AGENT ----
const userAgents = {
  linux:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.4 (KHTML like Gecko) Chrome/93.0.4542.2 Safari/537.36",
  win32:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
  darwin:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/93.0.4542.2 Safari/537.36",
};

export const userAgent: string =
  userAgents[process.platform] || userAgents["win32"];

// ---- Cookies ----
export async function saveCookies(cookies: Map<string, Electron.Cookie>) {
  const cookieFilePath = path.join(dataPath, "cookies.json");
  console.log(`saving cookies to ${cookieFilePath}`);

  const data = JSON.stringify(Array.from(cookies.values()));
  fs.writeFileSync(cookieFilePath, data);
  console.log("cookies saved...");
}
