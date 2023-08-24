import { BrowserWindow } from "electron";
import { SendChannels } from "../../types";
import IPC from "../ipc";

const apiName = "systemInfo";

const validSendChannel: SendChannels = {
  requestSystemInfo: requestSystemInfo,
};

const validRecieveChannel: string[] = ["getSystemInfo"];

function requestSystemInfo(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  const versionChrome = process.versions.chrome;
  const versionNode = process.versions.node;
  const versionElectron = process.versions.electron;

  const result = {
    chrome: versionChrome,
    node: versionNode,
    electron: versionElectron,
  };

  mainWindow.webContents.send("getSystemInfo", result);
}

const systemInfo = new IPC({
  apiName,
  validSendChannel,
  validRecieveChannel,
});

export default systemInfo;
