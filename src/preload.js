/* eslint-disable prettier/prettier */
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
//const { contextBridge } = require("electron");

/*contextBridge.exposeInMainWorld("electronAPI", {
    getPath: () => ipcRenderer.invoke("app:getPath"),
})
contextBridge.exposeInMainWorld("myAPI", {
    desktop: true
})
*/
window.contextIsolationOff = {
    doSomething: () => { console.log("Context isolation off!") }
}
