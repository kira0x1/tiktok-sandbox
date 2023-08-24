import { generateContextBridge } from "./ipc/contextBridge";
import systemInfo from "./ipc/systemInfo";

console.log("meow");

generateContextBridge([systemInfo]);
