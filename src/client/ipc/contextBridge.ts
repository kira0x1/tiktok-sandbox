import { contextBridge, ipcRenderer } from "electron";
import IPC from ".";
import { APIChannels } from "../../types";

export interface ContextBridgeApi {
  send: (channel: string, data: any) => void;
  recieve: (channel: string, func: (arg0: any) => void) => void;
}

export function generateContextBridge(ipcList: IPC[]) {
  const ipcChannels: APIChannels[] = [];

  for (const ipc of ipcList) {
    ipcChannels.push(ipc.channels);
  }

  const apiList: { [key: string]: ContextBridgeApi } = {};

  for (const channels of ipcChannels) {
    const api = getContextBridge(channels);
    const name = channels.apiName;
    apiList[name] = { ...api };
  }

  contextBridge.exposeInMainWorld("api", {
    ...apiList,
  });
}

function getContextBridge(channels: APIChannels): ContextBridgeApi {
  const { validRecieveChannel } = { ...channels };
  const validSendChannel = getValidSendChannels(channels);

  return {
    send(channel: string, data: any) {
      if (validSendChannel.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    recieve(channel: string, func: (arg0: any) => void) {
      if (validRecieveChannel.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args: [any]) => {
          func(...args);
        });
      }
    },
  };
}

function getValidSendChannels(channels: APIChannels): string[] {
  const { validSendChannel } = { ...channels };
  const result = Object.keys(validSendChannel);
  return result;
}
