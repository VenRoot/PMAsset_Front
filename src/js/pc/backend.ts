import { ClearTable } from "../anim.js";
import {insertRequest, request, ShowError} from "../backend.js";
import { Item, PC, Bildschirm, pushrequest } from "../interface";
import { AddRow, devices, GetMonitors, setDevices } from "./anim.js";
import { res_data, res_monitor } from "./interface.js";

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
        const data = JSON.parse(res.message) as res_data[];
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
            return res;
        });
    }
}

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