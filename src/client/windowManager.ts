import { app, BrowserWindow } from "electron";
import { publicPath } from "../util";
import path from "path";
import { EventEmitter } from "stream";

export type WINDOW_EVENTS = "window-created" | "window-closed";

export default class WindowManager {
  private settings: Electron.BrowserWindowConstructorOptions = {
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../../dist/client/preload.js"),
    },
  };

  window: Electron.BrowserWindow;
  onEvent: EventEmitter = new EventEmitter();

  public constructor(settings?: Electron.BrowserWindowConstructorOptions) {
    if (settings) {
      this.settings = settings;
    }

    app.on("ready", () => {
      this.onEvent.emit("ready");
      this.createWindow();
      this.onEvent.emit("window-created");
    });

    app.on("window-all-closed", this.onWindowAllClosed);
  }

  private createWindow() {
    this.window = new BrowserWindow(this.settings);
    this.window.loadFile(path.join(publicPath, "index.html"));

    this.window.once("ready-to-show", () => {
      this.window.show();
    });

    this.window.on("closed", this.onClose);
  }

  private onWindowAllClosed() {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }

  private onClose() {
    this.window = null;
  }
}
