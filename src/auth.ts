import { BrowserWindow, OnSendHeadersListenerDetails } from "electron";
import { saveCookies, userAgent } from "./util";

const cookiesFound: Map<string, Electron.Cookie> = new Map();

function startAuth() {
  const tiktokWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 950,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      partition: "persist:tiktok",
    },
  });

  tiktokWindow
    .loadURL("https://www.tiktok.com/login", {
      userAgent: userAgent,
    })
    .catch((e) => console.error("Loading tiktok login url failed", "ANY", e));

  const webContents = tiktokWindow.webContents;

  let found = false;

  webContents.session.webRequest.onSendHeaders(
    async (_details: OnSendHeadersListenerDetails) => {
      if (found) {
        return;
      }

      try {
        const cookieFilter = await webContents.session.cookies.get({});

        cookieFilter.map((c) => {
          if (!cookiesFound.get(c.name)) {
            // console.log(c);
          }
          cookiesFound.set(c.name, c);
        });

        webContents.once("before-input-event", async (_event, input) => {
          if (input.control && input.key.toLowerCase() === "s") {
            await saveCookies(cookiesFound);
            found = true;
          }
        });
      } catch (e) {
        console.error("Tiktok auth error", e);
      }
    }
  );
}

export default startAuth;
