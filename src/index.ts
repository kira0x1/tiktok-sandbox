import path from "path";
import { WindowManager } from "./client";
import systemInfo from "./client/ipc/systemInfo";
import { ipcMain } from "electron";

// checkFlags();

const mainWindow = new WindowManager({
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: true,
    preload: path.join(__dirname, "../dist/client/preload.js"),
  },
});

systemInfo.register(ipcMain, mainWindow.window);

mainWindow.onEvent.on("ready", () => {
  console.log("ready!");
});

mainWindow.onEvent.on("window-created", () => {
  console.log("WINDOW CREATED");
});
