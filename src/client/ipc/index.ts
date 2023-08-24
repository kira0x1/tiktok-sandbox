import { BrowserWindow, IpcMain } from "electron";
import { APIChannels, SendChannels } from "../../types";

export default class IPC {
  public apiName: string = "api";
  validSendChannel: SendChannels = {};
  validRecieveChannel: string[] = [];

  constructor(channels: APIChannels) {
    this.apiName = channels.apiName;
    this.validSendChannel = channels.validSendChannel;
    this.validRecieveChannel = channels.validRecieveChannel;
  }

  get channels(): APIChannels {
    return {
      apiName: this.apiName,
      validSendChannel: this.validSendChannel,
      validRecieveChannel: this.validRecieveChannel,
    };
  }

  register(ipcMain: IpcMain, mainWindow: BrowserWindow) {
    if (!mainWindow) return;
    Object.keys(this.validSendChannel).forEach((key) => {
      ipcMain.on(key, async (event, message) => {
        this.validSendChannel[key](mainWindow, event, message);
      });
    });
  }
}
