import {getKey, getEntries, ShowError, request, insertRequest} from "./backend.js";


export const Continue = async (ms: number) => {
    for(let i = 3; i > 0; i--)
    {
        SetLog(`Authentifizierung erfolgreich! Sie werden in ${i} Sekunden weitergeleitet!`);
        await new Promise(r => setTimeout(r, 1000));
    }
    if(sessionStorage.getItem("redirect") === undefined || sessionStorage.getItem("redirect") === null) document.location.href = "/";
    else document.location.href = sessionStorage.getItem("redirect")!.toString();
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

    console.debug(key);
    if(!key) return ShowError("Es konnte kein Key abgerufen werden! Ist der Server down oder wird er blockiert?", 500);
    if(!username || !password) return ShowError("Bitte überprüfen Sie ihre Angaben");
    //Check if username doesn't include @putzmeister.com
    if(!username.includes("@putzmeister.com")) username = username+="@putzmeister.com";
    let res = await request("auth", {method: "auth", SessionID: key, username: username, password: password}).catch(err => {
            document.getElementById("username")?.classList.add("border-red-500");
            document.getElementById("password")?.classList.add("border-red-500");
            ShowError(err.message, err.status);
    });
    if(!res) return ShowError("Es konnte keine Verbindung zum Server hergestellt werden!", 500);
    console.debug(res);
    if(res.status >= 200 && res.status < 300) 
    {
        sessionStorage.setItem("username", username);
        document.getElementById("username")?.classList.add("border-green-500");
        document.getElementById("password")?.classList.add("border-green-500");
        Continue(1000);
        
        return res.message;
    }
    else ShowError(res.message, res.status);
}