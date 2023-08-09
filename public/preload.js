const ce = require('./codeextractor/index');
const { contextBridge } = require('electron')

console.log(ce);

window.testPreload = function() {
    console.log("preload.js loaded");
};

window.ce = ce;

// contextBridge.exposeInMainWorld('preloaded', {
//   ce: () => process.preloaded.ce,
//   test: () => process.preloaded.testPreload(),
// });

// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron
//   // we can also expose variables, not just functions
// })
