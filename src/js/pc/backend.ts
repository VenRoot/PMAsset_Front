import {insertRequest, request, ShowError} from "../backend.js";
import { Item, PC, pushrequest } from "../interface.js";
import { AddRow, ClearTable } from "./anim.js";
import { res_data } from "./interface.js";

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
        console.log(res);
        
        console.log(res.message);
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
                    besitzer: element.BESITZER,
                    seriennummer: element.SN,
                    passwort: element.PASSWORT,
                    status: element.STATUS as any,
                    standort: element.STANDORT,
                    form: element.FORM,
                    equipment: element.EQUIPMENT as any                    
                }
            )
        });
        pc.forEach(entry => AddRow(entry));
    });
    ClearTable();
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
            hersteller: "Lenovo",
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
    else if(data.kind == "Monitor")
    {
    }

    
}