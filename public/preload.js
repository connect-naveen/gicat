/* eslint-disable prettier/prettier */
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
//const { contextBridge, ipcRenderer } = require("electron");
const ce = require('./codeextractor/index');
window.ce = ce;
