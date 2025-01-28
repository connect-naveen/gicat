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
          entitlements: "/build/entitlements.mac.plist",
          extendInfo: {
            NSAppleEventsUsageDescription:
              "Please grant us access to your Events so we can open your chosen Code Editor through GICAT.",
          },
        },
        appImage: {
          license: "license.md",
        },
        dmg: {},
        linux: {
          target: ["appImage"],
        },
        directories: {
          buildResources: "resources",
        },
        extraResources: ["resources/*"],
      },
    },
  },
});
