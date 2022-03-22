import { app, BrowserWindow, ipcMain, Notification, autoUpdater, dialog } from 'electron';
import * as path from 'path';
import * as crypto from "crypto";
import * as fs from "fs";
import { spawn, execFile, ChildProcessWithoutNullStreams, ChildProcess } from "child_process";
import * as env from "dotenv";
import { PDFUpload, PDFUploadSend } from './interface';

env.config({ path: path.join(__dirname, "..", ".env") });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let win:BrowserWindow;
app.commandLine.appendSwitch("--no-proxy-server");

// SSL/TSL: this is the self signed certificate support
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // On certificate error we disable default behaviour (stop loading the page)
  // and we then say "it is all fine - true" to the callback


  //Tell the user that there is a problem.
  // new Notification({title: "SSL/TSL", body: "SSL/TSL-Fehler"}).show();
  event.preventDefault();
  callback(true);
});


ipcMain.on("toMain", (event, args) => {
  win.webContents.send("log", "Ich bin in toMain");
  win.webContents.send("fromMain", args);
});

ipcMain.on("toOpenPDF", (event, file: string, ITNr: string) => {
  win.webContents.send("log", "Ich bin in toOpenPDF");
  console.log("toOpenPDF"); 
  process.stdout.write("toOpenPDF");
   //file is base64 encoded. Change it to binary and save it to a file
  const data = Buffer.from(file, 'base64');
  const filename = crypto.randomBytes(16).toString("hex") + ".pdf";
  const _path = path.join(app.getPath("temp"), filename);
  const writeStream = fs.createWriteStream(_path);
  writeStream.write(data, (err) => {
    if(err) return console.log(err);
    writeStream.end();


    //Wait till the file got modified
    const old = fs.statSync(_path).mtime.getUTCMilliseconds();
    let child:ChildProcess;
    process.platform == "linux" ? child = spawn("okular", [_path], {shell: "bash"}) : child = execFile('C:\\Program Files (x86)\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe', [_path]);
    child.on("exit", () => {
      const newTime = fs.statSync(_path).mtime.getUTCMilliseconds();
      if (newTime > old) {
        //file was modified
        return win.webContents.send("fromOpenPDF", {path: _path, ITNr: ITNr});
    }
    else return win.webContents.send("fromOpenPDF", false);
  });
  child.on("error", (err) => {
    console.log(err);
    throw err;
  });
  });
});

export class FSFile
{
    public data: FormData;
    public size: number;

    constructor(data: FormData, size: number)
    {
        this.data = data;
        this.size = size;
    }
}

ipcMain.handle("toUploadPDF", (event, args: PDFUpload) => {
  win.webContents.send("log", "Ich bin in toUploadPDF");
  if(!fs.existsSync(args._path)) return alert("Die PDF-Datei existiert nicht!");
    const file = fs.readFileSync(args._path, {encoding: "binary"});
    const filesize = fs.statSync(args._path).size;
    const f = new FormData();
    f.append("file", file);
    const File = new FSFile(f, filesize);

  return win.webContents.send("fromUploadPDF", {File: File, ITNr: args.ITNr, type: args.type} as PDFUploadSend);
})


ipcMain.handle("hello-req", (event, message) => {
  //Send back the message
  win.webContents.send("log", "Ich bin in hello-req");
  return crypto.createHash("sha256").update(message).digest("hex");
});

// ipcMain.handle("openpdf-req", (event, args: {file: Blob, ITNr: string}) => {
//   //save the pdf file
//   const file = args.file;
//   const filename = crypto.randomBytes(16).toString("hex") + ".pdf";
//   const _path = path.join(app.getPath("temp"), filename);
//   const writeStream = fs.createWriteStream(_path);
//   writeStream.write(file, (err) => {
//     if(err) return console.log(err);
//     writeStream.end();


//     //Wait till the file got modified
//     let old = fs.statSync(_path).mtime.getUTCMilliseconds();
//     let child = spawn("AcroRD32.exe", [_path]);
//     child.on("exit", () => {
//       let newTime = fs.statSync(_path).mtime.getUTCMilliseconds();
//       if (newTime > old) {
//         //file was modified
//         return {path: _path, ITNr: args.ITNr};
//     }
//     return false;
//   });
//   });
// })


const createWindow = (): void => {
  // Create the browser window.
  win = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences:
    {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      // allowRunningInsecureContent: true,
      // webSecurity: false,

    }
  });

  // and load the index.html of the app.
  win.loadURL("https://localhost:4000");

  // Open the DevTools.
  win.webContents.openDevTools();
  console.log(path.join(__dirname, "preload.js"));
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

const server = "https://arzweunodejs01.jumbo.net";
const url = `${server}/update/${process.platform}/${app.getVersion()}`;

autoUpdater.setFeedURL({url});

setInterval(() => {
  autoUpdater.checkForUpdates();
}, 1000 * 60);

autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Neustart", "Später"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail: "Eine neue Version ist verfügbar. Möchten Sie jetzt die neue Version herunterladen und installieren?"
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});

autoUpdater.on("error", message => {
  console.error("Error in auto-updater. " + message);
});


win.webContents.setWindowOpenHandler(() => {
  return { action: 'allow'}
});