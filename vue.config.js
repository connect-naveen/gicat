const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: "public/preload.js",
      builderOptions: {
        win: {
          target: ["nsis"],
          icon: "buildResources/icon.png",
        },
        nsis: {
          allowToChangeInstallationDirectory: true,
          createStartMenuShortcut: false,
          deleteAppDataOnUninstall: true,
          uninstallDisplayName: "GICAT-Uninstaller",
          license: "license.md",
          menuCategory: true,
          oneClick: false,
        },
        mac: {
          darkModeSupport: true,
          target: ["dmg"],
          icon: "buildResources/icon.png",
        },
        linux: {
          target: ["appImage"],
          icon: "buildResources/icon.png",
        },
        appImage: {
          license: "license.md",
        },
        dmg: {},
        directories: {
          buildResources: "resources",
        },
        extraResources: ["resources/*"],
      },
    },
  },
});
