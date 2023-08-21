import path from "path";
import { BrowserWindow } from "electron";
import startAuth from "./auth";
import { publicPath, readCookies } from "./util";
import { DatabaseManager, initDB } from "./database";

if (process.argv.includes("--db")) {
  initDB();
  console.log(`inserting cookie into db`);

  const cookies = readCookies();
  DatabaseManager.importCookies(cookies);

  console.log(`getting all`);
  DatabaseManager.getKnownCookies();
}

if (process.argv.includes("--initdb")) {
  initDB();
}

if (process.argv.includes("--auth")) {
  startAuth();
}

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
  });

  window.loadFile(path.join(publicPath, "index.html"));
}

// app.whenReady().then(() => {
//   createWindow();

//   app.on("activate", () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on("window-all-closed", () => {
//   if (process.platform === "darwin") app.quit();
// });
