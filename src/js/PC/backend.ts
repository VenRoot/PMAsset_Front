import { ClearTable } from "../anim.js";
import {insertRequest, request, ShowError, PDF, tryParseJSON, getUsers} from "../backend.js";
import { Item, PC, Bildschirm, pushrequest } from "../interface";
import { makeToast } from "../toast.js";
import { AddRow, devices, GetMonitors, setDevices } from "./anim.js";
import { PC_res_data, res_monitor } from "./interface.js";
export const Monitors:Bildschirm[] = [];

declare global
{
    interface Window
    {
        isElectron: boolean;
        api: {
            send: Function,
            receive: Function
        }
    }
}


export const getMonitors = ():Promise<Bildschirm[]> =>
{
    return new Promise(async(resolve, reject) => {
    const username = sessionStorage.getItem("username");
    const SessionID = sessionStorage.getItem("SessionID");
    let Mons: Bildschirm[] = [];
    //Remove all entries from Monitors array
    Monitors.splice(0, Monitors.length);

    if(username === null || SessionID === null)
    {
        ShowError("You are not logged in");
        return null;
    }

    let res = await request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "Monitor"}).catch(err => {
        ShowError(err.message, err.status);
        reject(err);
    });
    if(!res) throw new Error("No response from server");
    console.debug(res);
    const data = tryParseJSON(res.message) as res_monitor[];
    
    data.forEach((element) => {
        Mons.push({
            kind: "Monitor",
            type: element.TYPE as any,
            hersteller: element.HERSTELLER as any,
            model: element.MODEL as any,
            it_nr: element.ITNR as any,
            besitzer: element.BESITZER || "",
            attached: element.ATTACHED,
            seriennummer: element.SN as any,
            status: element.STATUS as any,
            // form: element.FORM as any,
            standort: "0" as any
        });
        Monitors.push({
            kind: "Monitor",
            type: element.TYPE as any,
            hersteller: element.HERSTELLER as any,
            model: element.MODEL as any,
            attached: element.ATTACHED,
            besitzer: element.BESITZER || "",
            it_nr: element.ITNR as any,
            seriennummer: element.SN as any,
            // form: element.FORM as any,
            status: element.STATUS as any,
            standort: "0" as any
        });
    });
        console.debug(Mons);
        console.warn(Monitors);
        resolve(Mons);
    });    
}

//Fetch the data from the backend server
export const getData = async () =>
{
    //Muss gemacht werden, damit er den Cache setzt
    const p1 = performance.now();
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    
    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    let [u, res] = await Promise.all([getUsers, request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "PC"}).catch(err => {
        ShowError(err.message, err.status);
        throw new Error(err.message);
    })]);
    console.debug(res);
    const data = tryParseJSON(res.message) as PC_res_data[];
    //convert the data to the pc interface
    const pc: PC[] = [];
    data.forEach((element) => {
        pc.push(
            {
                kind: "PC",
                it_nr: element.ITNR as any,
                type: element.TYPE as any,
                hersteller: element.HERSTELLER as any,
                besitzer: element.BESITZER || "",
                seriennummer: element.SN,
                passwort: element.PASSWORT,
                status: element.STATUS as any,
                standort: element.STANDORT,
                form: element.FORM?.split("|")[0] || "Nein",
                check: element.FORM?.split("|")[1] || "Nein",
                equipment: element.EQUIPMENT!,
                kommentar: element.KOMMENTAR || "",            
            }
        )
    });
    if(document.location.pathname.toLowerCase().includes("/pc")) ClearTable();
    setDevices(pc);
    //Check if the domain is the pc page
    if(document.location.pathname.toLowerCase().includes("/pc")) pc.forEach(entry => AddRow(entry));
    const p2 = performance.now();
    console.log("Performance: " + (p2 - p1) + "ms");
    return res;
}
export const setData = (data: Item, method: pushrequest ): Promise<{message: string, status: number}> =>
{
    return new Promise(async (resolve, reject) => 
    {
        //@ts-ignore
        if(data.passwort) data.kind = "PC";

        const username = window.sessionStorage.getItem("username");
        const SessionID = window.sessionStorage.getItem("SessionID");

        if(username == null || SessionID == null) return reject(new Error("No SessionID or username found"));
        if(data.kind == "PC")
        {
            if(data.form.indexOf("|") != -1) data.form = data.form.split("|")[0];
            let res = await insertRequest("setData", {method: method.method, SessionID: SessionID, username: username, device: {
                kind: "PC",
                hersteller: data.hersteller,
                it_nr: data.it_nr,
                type: data.type,
                seriennummer: data.seriennummer,
                equipment: data.equipment,
                standort: data.standort,
                status: data.status,
                besitzer: data.besitzer || "",
                form: (data.form || "Nein") +"|"+ (data.check || "Nein"),
                passwort: data.passwort || "",
                kommentar: data.kommentar || ""
            }}).catch((err: {message: string, status: number}) => {
                ShowError(err.message, err.status);
                reject();
            });
            if(!res) throw new Error("No response from server");
                resolve(res);
        }  
        else
        {
            reject(new Error("No kind found"));
        }      
    })
}


// export const UploadPDF = async (ITNr: string): Promise<{message: string, status: number, pdf: string}> =>
// {
//     return new Promise(async (resolve, reject) => {
//         const username = window.sessionStorage.getItem("username");
//         const SessionID = window.sessionStorage.getItem("SessionID");
//         if(username == null || SessionID == null) return reject("No SessionID or username found");
//         const res = await PDF({method: "POST", SessionID: SessionID, username: username, ITNr: ITNr}).catch(err => {
//             ShowError(err.message, err.status);
//             return reject(err.message);
//         });
//             console.log(res);
//             resolve(tryParseJSON(res as any));
//     });
// }

export const generatePDF = (ITNr: string): Promise<{message: string, status: number, pdf: string}> =>
{
    return new Promise(async (resolve, reject) => {
        const username = window.sessionStorage.getItem("username");
        const SessionID = window.sessionStorage.getItem("SessionID");
        if(username == null || SessionID == null) return reject("No SessionID or username found");
        const res = await PDF({method: "PUT", SessionID: SessionID, type: "User", username: username, ITNr: ITNr}).catch(err => {
            if(err)
            {
                ShowError(err.message, err.status);
                return reject(err.message);
            }
            
        });
            console.log(res);
            resolve(tryParseJSON(res as any));
    });
}

// export const createPDF = async (ITNr: string) =>
// {
//     return new Promise(async (resolve, reject) => {
//         if(devices.filter(entry => entry.it_nr == ITNr)[0].form == "Ja") return reject("PDF bereits vorhanden. Bitte löschen Sie diese");
//         const username = window.sessionStorage.getItem("username");
//         const SessionID = window.sessionStorage.getItem("SessionID");
//         if(username == null || SessionID == null) return reject("No SessionID or username found");
//         const res = await PDF({method: "PUT", SessionID: SessionID, type: "User", username: username, ITNr: ITNr}).catch(err => {
//                 ShowError(err.message, err.status);
//                 return reject(err.message);
//         });
//         if(!res) return reject("Fehler beim erstellen der PDF");
//         resolve(res.message);
//     });
// }

export const rewritePDF = async (ITNr: string):Promise<{message: string, status: number}> =>
{
    return new Promise(async (resolve, reject) => {
        const username = window.sessionStorage.getItem("username");
        const SessionID = window.sessionStorage.getItem("SessionID");
        if(username == null || SessionID == null) { makeToast("No SessionID or username found", "error"); return reject("No SessionID or username found"); } 
        const res = await PDF({method: "POST", SessionID: SessionID, type: "User", username: username, ITNr: ITNr}).catch(err => {
            return ShowError(err.message, err.status);
        });
        if(!res) { makeToast("Fehler beim erstellen der PDF", "error"); return reject()}
        resolve({message: res.message, status: res.status});
    })   
}

export const deletePDF = async (ITNr: string, User: boolean) =>
{
    return new Promise(async (resolve, reject) => {
        const username = window.sessionStorage.getItem("username");
        const SessionID = window.sessionStorage.getItem("SessionID");
        if(username == null || SessionID == null) return makeToast("No SessionID or username found", "error");
        const res = await PDF({method: "DELETE", SessionID: SessionID, type: User ? "User" : "Check", username: username, ITNr: ITNr}).catch(err => {
            ShowError(err.message, err.status);
            return;
        });
        if(!res) return makeToast("Fehler beim löschen der PDF", "error");
        makeToast("PDF erfolgreich gelöscht", "success");
        resolve(true);
    })
}

export const getPDF = async (ITNr: string, User: boolean) =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) return makeToast("No SessionID or username found", "error");
    if(User)
    {
        if(devices.find(entry => entry.it_nr == ITNr)?.form == "Nein") return alert("Keine PDF vorhanden. Bitte erstellen Sie diese");
    }
    else
    {
        if(devices.find(entry => entry.it_nr == ITNr)?.check == "Nein") return alert("Keine Checkliste vorhanden. Bitte erstellen Sie diese");
    }
    const res = await PDF({method: "GET", SessionID: SessionID, type: User ? "User" : "Check",  username: username, ITNr: ITNr}).catch((err: {resText: object | string, status: number, message: string}) => {
        ShowError(err.message, err.status);
        throw new Error(err.message);
    }) as unknown as Blob;


    if(window.isElectron)
    {
        const base = await (await blobToBase64(res)).split("base64,")[1];
        console.log(base);
        window.api.send("toOpenPDF", base, ITNr);
        return res;
    }
    const url = window.URL.createObjectURL(res);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${User ? ITNr : ITNr+"_Check"}.pdf`;
    a.click();
    return res;
}

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

const hex2a = (hexx:string) => {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
export const setEquipment = (PCITNr: string, MonITNr: string[]) =>
{
    return new Promise(async (resolve, reject) => {
        const username = window.sessionStorage.getItem("username");
        const SessionID = window.sessionStorage.getItem("SessionID");

        if(!username || !SessionID) return reject("No SessionID or username found");

        let res = await request("setMonitors", {method: "setMonitors", SessionID: SessionID, username: username}, {PCITNr: PCITNr, MonITNr: MonITNr});
        if(res.status != 200) return reject(res.message);
        getData();
        resolve(true);
    });

}

