import type { ContextBridgeApi } from "./ipc/contextBridge";

declare global {
  interface Window {
    api: ContextBridgeApi;
  }
}
