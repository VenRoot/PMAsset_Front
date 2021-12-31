import { insertRequest, ShowError } from "../backend";
import { Bildschirm, pushrequest } from "../interface";

export const setData = async (data: Bildschirm, method: pushrequest) =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    insertRequest("setData", {method: method.method, SessionID: SessionID, username: username, device: {
        kind: "Monitor",
        hersteller: "LG",
        it_nr: data.it_nr,
        type: data.type,
        seriennummer: data.seriennummer,
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