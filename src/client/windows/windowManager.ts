import { app, BrowserWindow } from "electron";
import path from "path";
import { EventEmitter } from "stream";

export type WINDOW_EVENTS = "window-created" | "window-closed";

export default class WindowManager {
  protected settings: Electron.BrowserWindowConstructorOptions = {
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../../dist/client/preload.js"),
    },
  };

  public window: Electron.BrowserWindow;
  public onEvent: EventEmitter = new EventEmitter();

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

  protected createWindow() {
    console.log("window manager create window called");
    this.window = new BrowserWindow(this.settings);

    this.window.once("ready-to-show", () => {
      this.window.show();
    });

    this.window.on("closed", this.onClose);
  }

  protected onWindowAllClosed() {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }

  protected onClose() {
    this.window = null;
  }
}
