import { app, ipcMain, dialog, TouchBar, shell } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import isDev from "electron-is-dev";
import { autoUpdater } from "electron-updater";
const electron = require("electron");
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;
const isProd: boolean = process.env.NODE_ENV === "production";

require("update-electron-app")({
  repo: "february-labs/devgpt-releases",
  updateInterval: "1 hour",
  logger: require("electron-log"),
});

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

const bug = new TouchBarButton({
  label: "🐛 Report Bug",
  backgroundColor: "#303030",
  click: () => {
    shell.openExternal("https://discord.gg/6GFtwzuvtw");
    shell.openExternal(
      "https://github.com/february-labs/devgpt-releases/issues/new"
    );
  },
});

const docs = new TouchBarButton({
  label: "🕵️ Docs",
  backgroundColor: "#303030",
  click: () => {
    shell.openExternal("https://february-labs.gitbook.io/february-labs/");
  },
});

const task = new TouchBarButton({
  label: "🧑‍🔬 New Task",
  backgroundColor: "#303030",
  click: () => {
    main.webContents.send("new-task");
  },
});

const settings = new TouchBarButton({
  label: "⚙️ Tech Stack",
  backgroundColor: "#303030",
  click: () => {
    main.webContents.send("open-settings");
  },
});

const touchBar = new TouchBar({
  items: [
    task,
    docs,
    bug,
    settings,
    // new TouchBarSpacer({ size: "small" }),
  ],
});

let main;

(async () => {
  await app.whenReady();

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  const default_width = 1300;
  const default_height = 800;

  main = createWindow("main", {
    width: width < default_width ? width : default_width,
    height: height < default_height ? height : default_height,
    show: false,
    frame: false,
    transparent: false,
    resizable: true,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
  });

  if (process.platform === "darwin") {
    main.show();
  } else {
    Promise.all([main.maximize(), main.show()]);
  }

  main.once("ready-to-show", () => {
    // Important: make sure this is commented out before building
    Object.defineProperty(app, "isPackaged", {
      get() {
        return true;
      },
    });

    autoUpdater.setFeedURL({
      provider: "github",
      owner: "february-labs",
      repo: "devgpt-releases",
      channel: "latest",
    });
    autoUpdater.checkForUpdatesAndNotify();
  });

  if (isDev) {
    const port = "8888";
    await main.loadURL(`http://localhost:${port}`);
  } else {
    await main.loadURL("app://./");
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("user-is-logged-in", (event, arg) => {
  main.setTouchBar(touchBar);
});

ipcMain.on("user-is-logged-out", (event, arg) => {
  main.setTouchBar(null);
});

ipcMain.on("select-dirs", async (event, arg) => {
  const result = await dialog.showOpenDialog(main, {
    properties: ["openDirectory"],
  });
  event.sender.send("file-has-been-selected", result.filePaths[0]);
});

ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update-available", () => {
  main.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
  main.webContents.send("update_downloaded");
  main.setClosable(true);
  autoUpdater.quitAndInstall();
});
