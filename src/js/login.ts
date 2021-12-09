import {getKey, getEntries, ShowError, request, response} from "./backend.js";


export const Sleep = async (ms: number) => {
    for(let i = 5; i > 0; i--)
    {
        SetLog(`Authentifizierung erfolgreich! Sie werden in ${i} Sekunden weitergeleitet!`);
        await new Promise(r => setTimeout(r, 1000));
    }
    history.back();
}


export const SetLog = (text: string) => {
    document.getElementById("Log")!.innerHTML = text;
}

export const AddLog = (text: string) =>
{
    document.getElementById("Log")!.innerHTML += "\n"+text;
}

export const login = async (username: string, password: string) =>
{

    let key = await getKey();
    if(!key) return ShowError("Es konnte kein Key abgerufen werden! Ist der Server down oder wird er blockiert?", 500);

    if(!username || !password) return ShowError("Bitte überprüfen Sie ihre Angaben");

    request({method: "auth", SessionID: key, username: username, password: password}, (res: {message: string, status: number}, err: response) => {
        if(err) throw err;
        if(res.status >= 200 && res.status < 300) 
        {
            sessionStorage.setItem("username", username);
            return res.message;
        }
        else ShowError(res.message, res.status);
    });

}