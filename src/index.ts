import path from "path";
import systemInfo from "./client/ipc/systemInfo";
import { ipcMain } from "electron";
import { checkFlags } from "./util";
import MainWindow from "./client/windows/mainWindow";

checkFlags();

const mainWindow = new MainWindow({
  width: 1200,
  height: 800,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: true,
    preload: path.join(__dirname, "../dist/client/preload.js"),
  },
});

mainWindow.onEvent.on("window-created", () => {
  systemInfo.register(ipcMain, mainWindow.window);
  mainWindow.window.webContents.openDevTools();
  console.log("WINDOW CREATED");
});
