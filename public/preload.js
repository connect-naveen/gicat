const ce = require('./codeextractor/index');
const { contextBridge } = require('electron')

console.log(ce);

window.testPreload = () => {
    console.log("preload.js loaded");
};

contextBridge.exposeInMainWorld('preloaded', {
  ce: () => process.preloaded.ce,
  test: () => process.preloaded.testPreload(),
});
