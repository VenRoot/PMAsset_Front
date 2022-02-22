import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import * as path from 'path';
import * as crypto from "crypto";
import * as fs from "fs";
import { spawn } from "child_process";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// SSL/TSL: this is the self signed certificate support
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // On certificate error we disable default behaviour (stop loading the page)
  // and we then say "it is all fine - true" to the callback


  //Tell the user that there is a problem.
  new Notification({title: "SSL/TSL", body: "SSL/TSL-Fehler"}).show();
  event.preventDefault();
  callback(true);
});



ipcMain.handle("hello-req", (event, message) => {
  //Send back the message
  return crypto.createHash("sha256").update(message).digest("hex");
});

ipcMain.handle("openpdf-req", (event, args: {file: Blob, ITNr: string}) => {
  //save the pdf file
  const file = args.file;
  const filename = crypto.randomBytes(16).toString("hex") + ".pdf";
  const _path = path.join(app.getPath("temp"), filename);
  const writeStream = fs.createWriteStream(_path);
  writeStream.write(file, (err) => {
    if(err) return console.log(err);
    writeStream.end();


    //Wait till the file got modified
    let old = fs.statSync(_path).mtime.getUTCMilliseconds();
    let child = spawn("AcroRD32.exe", [_path]);
    child.on("exit", () => {
      let newTime = fs.statSync(_path).mtime.getUTCMilliseconds();
      if (newTime > old) {
        //file was modified
        return {path: _path, ITNr: args.ITNr};
    }
    return false;
  });
  });
})

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences:
    {
      nodeIntegration: true,

      contextIsolation: false,
      allowRunningInsecureContent: true,
      webSecurity: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL("https://localhost:3000");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.