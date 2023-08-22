import { app } from "electron";
import { checkFlags } from "./util";
import Main from "./client/main";

checkFlags();
Main.main(app);

Main.onEvent.on("window-created", () => {
  console.log("WINDOW CREATED");
});
