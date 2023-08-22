import { contextBridge } from "electron";

console.log("hello, world");

contextBridge.exposeInMainWorld("version", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});
