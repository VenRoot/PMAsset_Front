import { ClearTable } from "../anim.js";
import {insertRequest, request, ShowError, PDF} from "../backend.js";
import { Item, PC, Bildschirm, pushrequest } from "../interface";
import { AddRow, devices, GetMonitors, setDevices } from "./anim.js";
import { PC_res_data, res_monitor } from "./interface.js";
export const Monitors:Bildschirm[] = [];


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

    request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "Monitor"}, async (res: {message: string, status: number}, err: {message: string, status: number}) => {
        if(err)
        {
            ShowError(err.message, err.status);
            reject(new Error(err.message));
        }
        console.debug(res);

        const data = JSON.parse(res.message) as res_monitor[];
        
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
                form: element.FORM as any,
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
                form: element.FORM as any,
                status: element.STATUS as any,
                standort: "0" as any
            });
        });
        console.debug(Mons);
        console.warn(Monitors);
        resolve(Mons);
    });
    });    
}

//Fetch the data from the backend server
export const getData = async () =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");

    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    let res = request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "PC"}, (res: {message: string, status: number}, err: {message: string, status: number}) => {
        if(err)
        {
            ShowError(err.message, err.status);
            throw new Error(err.message);
        }
        console.debug(res);
        
        console.debug(res.message);
        const data = JSON.parse(res.message) as PC_res_data[];
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
                    form: element.FORM as any,
                    equipment: element.EQUIPMENT!                    
                }
            )
        });
        if(document.location.pathname.toLowerCase().includes("/pc")) ClearTable();
        setDevices(pc);
        //Check if the domain is the pc page
        if(document.location.pathname.toLowerCase().includes("/pc")) pc.forEach(entry => AddRow(entry));
    });
    
    return res;
}
export const setData = async (data: Item, method: pushrequest ) =>

{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");

    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    if(data.kind == "PC")
    {
        insertRequest("setData", {method: method.method, SessionID: SessionID, username: username, device: {
            kind: "PC",
            hersteller: data.hersteller,
            it_nr: data.it_nr,
            type: data.type,
            seriennummer: data.seriennummer,
            equipment: data.equipment,
            standort: data.standort,
            status: data.status,
            besitzer: data.besitzer || "",
            form: data.form || "",
            passwort: data.passwort || "",
        }}, (res: {message: string, status: number}, err: {message: string, status: number}) => {
            if(err)
            {
                ShowError(err.message, err.status);
                throw new Error(err.message);
            }
            console.log(res);
            return res;
        });
    }
}


export const generatePDF = async (ITNr: string): Promise<{message: string, status: number, pdf: string}> =>
{
    return new Promise((resolve, reject) => {
        const username = window.sessionStorage.getItem("username");
        const SessionID = window.sessionStorage.getItem("SessionID");
        if(username == null || SessionID == null) return reject("No SessionID or username found");
        PDF({method: "PUT", SessionID: SessionID, username: username, ITNr: ITNr}, (res: {message: string, status: number}, err: {message: string, status: number}) => {
            if(err)
            {
                ShowError(err.message, err.status);
                return reject(err.message);
            }
            console.log(res);
            resolve(res as any);
        });
    });
}    

// export const doPDF = async (ITNr: string) =>
// {
//     let x = await generatePDF(ITNr);
//     download(x.pdf, ITNr, "pdf");

// }



// export const getPDF = (ITNr: string) =>
// {
//     if(devices.filter(entry => entry.it_nr == ITNr)[0].form == "Nein") return alert("Keine PDF vorhanden. Bitte erstellen Sie diese");
    
//     window!.open(`https://localhost:5000/pdf/${ITNr}/output.pdf`, '_blank')!.focus();

// }

export const createPDF = (ITNr: string) =>
{
    if(devices.filter(entry => entry.it_nr == ITNr)[0].form == "Ja") return alert("PDF bereits vorhanden. Bitte löschen Sie diese");
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) return alert("No SessionID or username found");
    PDF({method: "PUT", SessionID: SessionID, username: username, ITNr: ITNr}, (res: {message: string, status: number}, err: {message: string, status: number}) => {
        if(err)
        {
            ShowError(err.message, err.status);
            return alert(err.message);
        }
        console.log(res);
        alert(res.message);
    });
}

export const rewritePDF = (ITNr: string, callback?: Function) =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) return alert("No SessionID or username found");
    PDF({method: "POST", SessionID: SessionID, username: username, ITNr: ITNr}, (res: {message: string, status: number}, err: {message: string, status: number}) => {
        if(err)
        {
            ShowError(err.message, err.status);
            return alert(err.message);
        }
        console.log(res);
        if(callback) callback(res);
    });
}

export const deletePDF = (ITNr: string, callback?: Function) =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) return alert("No SessionID or username found");
    PDF({method: "DELETE", SessionID: SessionID, username: username, ITNr: ITNr}, (res: {message: string, status: number}, err: {message: string, status: number}) => {
        if(err)
        {
            ShowError(err.message, err.status);
            return alert(err.message);
        }
        console.log(res);
        if(callback) callback(res);
    });
}

export const getPDF = async (ITNr: string) =>
{
    console.log(ITNr);
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    if(devices.find(entry => entry.it_nr == ITNr)?.form == "Nein") return alert("Keine PDF vorhanden. Bitte erstellen Sie diese");
    PDF({method: "GET", SessionID: SessionID, username: username, ITNr: ITNr}, (res: Uint8Array, err: {message: string, status: number}) => {
        if(err)
        {
            ShowError(err.message, err.status);
            throw new Error(err.message);
        }  
        //@ts-ignore
        saveByteArray([res], ITNr + ".pdf");
        console.log(res);
        //window!.open(res.pdf, '_blank')!.focus();
        return res;
    });
}

const hex2a = (hexx:string) => {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
hex2a('32343630'); // returns '2460'

const saveByteArray = (function () {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    return function (data:any, name:any) {
        var blob = new Blob(data, {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());


// // Function to download data to a file
// const download = (data:any, filename:string, type:string) => {
//     var file = new Blob([data], {type: type});
//         var a = document.createElement("a"),
//                 url = URL.createObjectURL(file);
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         setTimeout(function() {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);  
//         }, 0);
// }

export const setEquipment = async (PCITNr: string, MonITNr: string[]) =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");

    if(!username || !SessionID) throw new Error("No SessionID or username found");

    request("setMonitors", {method: "setMonitors", SessionID: SessionID, username: username}, async (res: {message: string, status: number}, err: {message: string, status: number}) => {
        getData();
     }, {
        PCITNr: PCITNr, MonITNr: MonITNr
    })

}


export const refreshPCs = async () =>
{
    
}


