import { ClearTable } from "../anim.js";
import { insertRequest, request, ShowError } from "../backend.js";
import { Bildschirm, PC, pushrequest } from "../interface";
import { AddRow, setDevices } from "./anim.js";
import { res_monitor } from "./interface";
import {devices as _PCDevices} from "../PC/anim.js";
import { PC_res_data } from "../PC/interface.js";
import { getData as getPCData } from "../PC/backend.js";

export const PCDevices = _PCDevices;

export const getData = async() =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");

    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    let res = request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "Monitor"}, async (res: {message: string, status: number}, err: {message: string, status: number}) =>
    {
        if(err)
        {
            ShowError(err.message, err.status);
            throw new Error(err.message);
        }
        console.debug(res);

        console.debug(res.message);
        const data = JSON.parse(res.message) as res_monitor[];
        //convert the data to the pc interface
        const Monitors: Bildschirm[] = [];

        let PCs = await getPCs();

        data.forEach((element) => {
            if(PCs.filter(pc => pc.equipment.includes(element.ITNR)))
            {
                console.debug(PCs);
                console.debug(element);
                
                console.debug((PCs.filter(pc => pc.equipment.includes(element.ITNR))?.[0]?.it_nr || "-"));
                
                element.ATTACHED = (PCs.filter(pc => pc.equipment.includes(element.ITNR))?.[0]?.it_nr || "-");
            }
            Monitors.push({
                kind: "Monitor",
                type: element.TYPE as any,
                hersteller: element.HERSTELLER as any,
                model: element.MODEL as any,
                attached: element.ATTACHED as any,
                it_nr: element.ITNR as any,
                form: element.FORM,
                besitzer: element.BESITZER || "",
                seriennummer: element.SN as any,
                status: element.STATUS as any,
                standort: "0" as any
            });
        });
        setDevices(Monitors);
        if(document.location.pathname.toLowerCase().includes("/bildschirm")) Monitors.forEach(entry => AddRow(entry));
    });
    if(document.location.pathname.toLowerCase().includes("/bildschirm")) ClearTable();
    return res;
}

export const checkVerknüpfung = async (it_nr: string) => PCDevices.filter(entry => entry.equipment.includes(it_nr))

export const setData = async (data: Bildschirm, method: pushrequest) =>
{
    console.log("J");
    
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    insertRequest("setData", {method: method.method, SessionID: SessionID, username: username, device: {
        kind: "Monitor",
        hersteller: data.hersteller,
        it_nr: data.it_nr,
        type: data.type,
        seriennummer: data.seriennummer,
        model: data.model,
        attached: data.attached || "",
        standort: data.standort,
        status: data.status,
        besitzer: data.besitzer || "",
        form: data.form || "",
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

//Fetch the data from the backend server
export const getPCs = async ():Promise<PC[]> =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");

    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    let result:PC[] = [];
    request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "PC"}, async (res: {message: string, status: number}, err: {message: string, status: number}) => {
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

        result = pc;
        // setDevices(pc);
        //Check if the domain is the pc page
        // if(document.location.pathname.toLowerCase().includes("/pc")) pc.forEach(entry => AddRow(entry));
    });
    while(result.length == 0) await new Promise(resolve => setTimeout(resolve, 100));
    if(document.location.pathname.toLowerCase().includes("/pc")) ClearTable();
    return result;
}