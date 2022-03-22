export {};

declare global
{
  interface Window
  {
    isElectron: boolean,
    ipcRenderer: Electron.IpcRenderer
  }
}
import {ipcRenderer, contextBridge} from "electron";
function init() {
  // add global variables to your web page
  window.isElectron = true;
  window.ipcRenderer = ipcRenderer;
  window["isElectron"] = true;
  window["ipcRenderer"] = ipcRenderer;
}

init();

//Call init everytime another page is loaded
window.addEventListener('load', init);

const channels = ["Main", "OpenPDF", "UploadPDF"];

const fromChannels = channels.map(channel => `from${channel}`);
const toChannels = channels.map(channel => `to${channel}`);

contextBridge.exposeInMainWorld("api", {
  send: (channel: string, ...args:any) => {
    console.log(...args);
    console.log(channel);
    if (toChannels.includes(channel)) ipcRenderer.send(channel, ...args);
    },
  receive: (channel: string, callback: CallBack) => {
    console.log(channel);

    if(fromChannels.includes(channel)) ipcRenderer.on(channel, (event, ...args) => callback(...args));
  }
});

console.log("Hi");
type CallBack = (...args: any[]) => void;