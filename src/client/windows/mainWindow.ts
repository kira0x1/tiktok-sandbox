import { WindowManager } from "..";
import path from "path";
import { publicPath } from "../../util";

export default class MainWindow extends WindowManager {
  protected createWindow(): void {
    console.log("main window create window called");
    super.createWindow();
    this.window.loadFile(path.join(publicPath, "index.html"));
  }
}
