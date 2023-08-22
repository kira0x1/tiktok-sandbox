import { BrowserWindow } from "electron";
import { publicPath } from "../util";
import path from "path";
import { EventEmitter } from "stream";

export default class Main {
  static mainWindow: Electron.BrowserWindow;
  static app: Electron.App;
  static onEvent: EventEmitter = new EventEmitter();

  public static main(app: Electron.App) {
    Main.app = app;
    Main.app.on("window-all-closed", Main.onWindowAllClosed);
    Main.app.on("ready", Main.onReady);
  }

  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      Main.app.quit();
    }
  }

  private static createWindow() {
    Main.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "./preload.js"),
      },
    });

    Main.mainWindow.loadFile(path.join(publicPath, "index.html"));

    Main.mainWindow.once("ready-to-show", () => {
      Main.mainWindow.show();
    });

    Main.mainWindow.on("closed", Main.onClose);
  }

  private static onReady() {
    Main.createWindow();
    Main.onEvent.emit("window-created");
  }

  private static onClose() {
    Main.mainWindow = null;
  }
}
