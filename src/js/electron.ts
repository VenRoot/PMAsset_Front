import { PDF } from "./backend";
import { FSFile } from "./interface";
import { makeToast } from "./toast";



// const ShowPDF = (args: {file: Blob, ITNr: string}) => 
// {
//     ipcRenderer.invoke("openpdf-res", (args)).then((result: false | {path: string, ITNr: string}) => {
//         if(!result) return;
//         //Hat die PDF zurückbekommen. Wieder hochladen
//         UploadPDF(result.path, result.ITNr);
//     })
// }

// const UploadPDF = async (_path: string, ITNr: string) => {
//     const username = sessionStorage.getItem("username");
//     const key = sessionStorage.getItem("SessionID");
//     if(!username || !key) return alert("Bitte loggen Sie sich erneut ein!");

//     if(!fs.existsSync(_path)) return alert("Die PDF-Datei existiert nicht!");
//     const pdf = fs.readFileSync(_path);
//     //Append the file to the input automatically

//     const file = fs.readFileSync(_path, {encoding: "binary"});
//     const filesize = fs.statSync(_path).size;
//     const f = new FormData();
//     const File = new FSFile(f, filesize);
//     f.append("file", file);

//     let res = await PDF({ITNr: ITNr, method: "POST", SessionID: key, username: username, uploadOwn: true, file: File})
//     if(res.status == 200) makeToast("PDF hochgeladen!", "success");
//     else makeToast("Fehler beim Hochladen der PDF!", "error");
// }

