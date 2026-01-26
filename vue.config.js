const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  lintOnSave: false, //TODO: ONLY TEMPORARY
  transpileDependencies: true,
  publicPath: "./",
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: "public/preload.js",
      builderOptions: {
        win: {
          target: ["nsis"],
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
        },
        linux: {
          target: ["appImage"],
          category: "Development",
        },
        appImage: {
          license: "license.md",
        },
        dmg: {},
      },
    },
  },
  pwa: {
    iconPaths: {
      favicon32: "favicon.png",
      favicon16: "favicon.png",
      appleTouchIcon: "favicon.png",
      maskIcon: "favicon.png",
      msTileImage: "favicon.png",
    },
  },
});
