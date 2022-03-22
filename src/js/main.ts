import * as anim from "./anim.js";
import {checkUser, PDF} from "./backend.js";
import { PDFUploadSend } from "./electron_interface.js";
import { FSFile } from "./interface.js";
import { AddCustomPDF, getDevice } from "./PC/anim.js";
import { setData } from "./PC/backend.js";
import { makeToast } from "./toast.js";
export * from "./backend.js";
export * from "./anim.js";
export * from "./toast.js";

export let DEBUG = false;

console.debug = (...args: any[]) => DEBUG ? console.log(...args) : null;

window.api.receive("log", console.log);

window.api.receive("fromOpenPDF", console.log);
window.api.receive("fromUploadPDF", (args: PDFUploadSend) => {
    const device = getDevice(args.ITNr)[0];
    const username = window.sessionStorage.getItem("username");
    const key = window.sessionStorage.getItem("SessionID");
    if(!username || !key) return alert("Bitte loggen Sie sich ein!");

    setData(device, {device: device, method: "POST", username: username, SessionID: key});
    PDF({ITNr: args.ITNr, method: "POST", SessionID: key, username: username, uploadOwn: true, file: args.File, type: args.type}).then(res =>{
        if(res.status == 200) makeToast("PDF hochgeladen!", "success");
        else makeToast("Fehler beim Hochladen der PDF!", "error");
    })

            
});
