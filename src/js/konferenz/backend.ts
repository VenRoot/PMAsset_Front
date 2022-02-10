import { ClearTable } from "../anim.js";
import { insertRequest, request, ShowError } from "../backend.js";
import { Konferenz, pushrequest } from "../interface";
import { AddRow, setDevices } from "./anim.js";
import { res_konferenz } from "./interface";


export const getData = async() =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");

    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    let res = await request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "Konferenz"}).catch(err => {
        ShowError(err.message, err.status);
        throw new Error(err.message);
    });
    console.debug(res);
    console.debug(res.message);
    const data = JSON.parse(res.message) as res_konferenz[];
    //convert the data to the pc interface
    const Konfis: Konferenz[] = [];
    data.forEach((element) => {
        Konfis.push(
            {
                kind: "Konferenz",
                it_nr: element.ITNR as any,
                hersteller: element.HERSTELLER as any,
                model: element.MODEL as any,  
                seriennummer: element.SN,
                standort: element.STANDORT,
                status: element.STATUS as any,
                besitzer: element.BESITZER || "",
                form: element.FORM as any
            });
    });
    setDevices(Konfis);
    if(document.location.pathname.toLowerCase().includes("/konferenz")) Konfis.forEach(entry => AddRow(entry));
    if(document.location.pathname.toLowerCase().includes("/konferenz")) ClearTable();
    return res;
}

export const setData = async (data: Konferenz, method: pushrequest) =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    insertRequest("setData", {method: method.method, SessionID: SessionID, username: username, device: {
        kind: "Konferenz",
        it_nr: data.it_nr,
        seriennummer: data.seriennummer,
        hersteller: data.hersteller, 
        model: data.model,
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
        return res;
    });
}