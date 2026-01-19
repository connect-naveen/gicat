"use strict";

import { app, protocol, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import * as path from "path";

//const { ipcMain } = require("electron");
const fs = require("fs").promises;
const os = require("os");
const { spawn } = require("child_process");

require("@electron/remote/main").initialize();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
const isDevelopment = process.env.NODE_ENV !== "production";

function registerLocalVideoProtocol() {
  protocol.registerFileProtocol("local-video", (request, callback) => {
    const url = request.url.replace(/^local-video:\/\//, "");
    // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
    const decodedUrl = decodeURI(url); // Needed in case URL contains spaces
    try {
      // eslint-disable-next-line no-undef
      return callback(path.join(__static, decodedUrl));
    } catch (error) {
      console.error(
        "ERROR: registerLocalVideoProtocol: Could not get file path:",
        error
      );
    }
  });
}

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, "../build/icon.png"),
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      //nodeIntegrationInWorker: true,
      sandbox: false,
      preload: path.resolve(__dirname, "preload.js"),
      spellcheck: false,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      enableBlinkFeatures: false,
    },
  });

  // Remove Windows and Linux tray menu
  win.removeMenu();

  // Close window warning
  win.on("close", (e) => {
    e.preventDefault();
    dialog
      .showMessageBox({
        type: "question",
        buttons: [" No ", " Yes "],
        title: "Closing the program!",
        message: "Do you really want to close the program?",
        defaultId: 0,
        cancelId: 1,
      })
      .then(({ response }) => {
        if (response) {
          win.destroy();
          app.quit();
        }
      });
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  ipcMain.handle("app:getPath", () => {
    return app.getPath("userData");
  });
  createWindow();
  registerLocalVideoProtocol();
});

app.on("browser-window-created", (_, window) => {
  require("@electron/remote/main").enable(window.webContents);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

app.on("web-contents-created", (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // Open all URLs in the user's default browser
    setImmediate(() => {
      shell.openExternal(url);
    });
    return { action: "deny" };
  });
});

ipcMain.handle("read-directory", async (event, dirPath) => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    return files.map((f) => f.name);
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle("get-platform", () => os.platform());
ipcMain.handle("get-basename", (event, filePath) => path.basename(filePath));
ipcMain.handle("check-file-exists", (event, filePath) => {
  return fs.existsSync(filePath);
});

ipcMain.handle(
  "open-file-in-editor",
  (event, { editorPath, filePath, isVsCode, line, isMacApp }) => {
    try {
      let platform = os.platform();
      let opts = { detached: true };
      let pathToOpen = filePath;
      let lineNumber = line !== undefined && line !== null ? line : 0;
      if (isVsCode && platform !== "darwin") {
        pathToOpen += ":" + lineNumber + ":0";
        spawn(editorPath, ["--goto", pathToOpen], opts);
      } else if (isVsCode && platform === "darwin") {
        let ep = editorPath + "/Contents/MacOS/Electron";
        pathToOpen += ":" + lineNumber + ":0";
        spawn(ep, ["--goto", pathToOpen], opts);
      } else if (isMacApp && platform === "darwin") {
        let appName = path.basename(editorPath, ".app");
        let macOSPath = `${editorPath}/Contents/MacOS/${appName}`;
        spawn(macOSPath, [filePath], opts);
      } else {
        spawn(editorPath, [filePath], opts);
      }
      return true;
    } catch (e) {
      return { error: e.message };
    }
  }
);
