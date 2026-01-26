const { app, BrowserWindow } = require("electron");
const path = require("path");
const { createProtocol } = require("vue-cli-plugin-electron-builder/lib");

app.disableHardwareAcceleration();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "../public/favicon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      spellcheck: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    mainWindow.loadURL("app://./index.html");
    // mainWindow.webContents.openDevTools(); // Remove for production
  }

  mainWindow.onbeforeunload = (e) => {
    e.returnValue = false;
  };
};

app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
