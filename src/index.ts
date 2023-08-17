import path from "path";
import { app, BrowserWindow } from "electron";
import startAuth from "./auth";
import { publicPath } from "./util";

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
  });

  window.loadFile(path.join(publicPath, "index.html"));
  if (process.argv.includes("--auth")) startAuth();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform === "darwin") app.quit();
});
