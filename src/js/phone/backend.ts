import { ClearTable } from "../anim.js";
import { insertRequest, request, ShowError, tryParseJSON } from "../backend.js";
import { Phone, pushrequest } from "../interface";
import { makeToast } from "../toast.js";
import { AddRow, setDevices } from "./anim.js";
import { res_phone } from "./interface";


export const getData = async() =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");

    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    let res = await request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "Phone"}).catch(err => {
        ShowError(err.message, err.status);
        throw new Error(err.message);
    });
    console.debug(res);
    console.debug(res.message);
    const data = tryParseJSON(res.message) as res_phone[];
    //convert the data to the pc interface
    const Phones: Phone[] = [];
    data.forEach((element) => {
        Phones.push(
            {
                kind: "Phone",
                it_nr: element.ITNR as any,
                model: element.MODEL as any,  
                seriennummer: element.SN,
                standort: element.STANDORT,
                status: element.STATUS as any,
                besitzer: element.BESITZER || "",
                // form: element.FORM as any
            });
    });
    setDevices(Phones);
    if(document.location.pathname.toLowerCase().includes("/phone")) await ClearTable();
    if(document.location.pathname.toLowerCase().includes("/phone")) Phones.forEach(entry => AddRow(entry));
    return res;
}

export const setData = async (data: Phone, method: pushrequest) =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    let res = await insertRequest("setData", {method: method.method, SessionID: SessionID, username: username, device: {
        kind: "Phone",
        it_nr: data.it_nr,
        seriennummer: data.seriennummer,
        model: data.model,
        standort: data.standort,
        status: data.status,
        besitzer: data.besitzer || "",
        // form: data.form || "",
    }}).catch(err => {
        ShowError(err.message, err.status);
    });

    if(!res) return makeToast("Es wurde keine Antwort vom Server erhalten (Timeout)", "error");
    makeToast(res.message, "success");
}