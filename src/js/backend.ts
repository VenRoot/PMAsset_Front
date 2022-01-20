import { pullrequest, pushrequest, response } from "./interface";

export const request = (subdomain: string, auth: pullrequest, callback: Function, optional?: any) =>
{
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4)
        {
            console.log(xmlhttp);
            
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) callback(JSON.parse(xmlhttp.responseText), null);
            //ERROR
            else callback(null, JSON.parse(xmlhttp.responseText));
        }
    };
    console.log("https://localhost:5000/"+subdomain);
    xmlhttp.open("GET", "https://localhost:5000/"+subdomain, true);
    console.log(auth);
    
    switch(auth.method)
    {
        case "newKey": xmlhttp.setRequestHeader("auth", JSON.stringify({type: "RequestKey"})); break;

        case "auth": if(!auth.SessionID || !auth.username || !auth.password) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("auth", JSON.stringify({type: "AuthUser", SessionID: auth.SessionID, username: auth.username, password: auth.password}));
        break;

        case "getEntries": if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("auth", JSON.stringify({type: "check", SessionID: auth.SessionID, username: auth.username}));
        xmlhttp.setRequestHeader("req", JSON.stringify({type: auth.type})); break;

        case "check": if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("auth", JSON.stringify({type: "check", SessionID: auth.SessionID, username: auth.username})); break;

        case "refresh": if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("auth", JSON.stringify({type: "check", SessionID: auth.SessionID, username: auth.username}));
        xmlhttp.setRequestHeader("Session", JSON.stringify({type: "check", SessionID: auth.SessionID, username: auth.username})); break;

        case "setMonitors": if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("auth", JSON.stringify({type: "check", SessionID: auth.SessionID, username: auth.username}));
        xmlhttp.setRequestHeader("data", JSON.stringify({PCITNr: optional.PCITNr,  MonITNr: optional.MonITNr, SessionID: auth.SessionID, username: auth.username}));
    }
    xmlhttp.send(null);
}

/**
 * 
 * @param subdomain 
 * @param auth 
 * @param callback 
 */
export const insertRequest = (subdomain: string, auth: pushrequest, callback: Function) =>
{
    const xmlhttp = new XMLHttpRequest();
    //push data to the backend
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4)
        {
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) callback(JSON.parse(xmlhttp.responseText), null);
            //ERROR
            else callback(null, JSON.parse(xmlhttp.responseText));
        }
    };
    xmlhttp.open(auth.method, "https://localhost:5000/"+subdomain, true);

    xmlhttp.setRequestHeader("auth", JSON.stringify({SessionID: auth.SessionID, username: auth.username}));
    switch(auth.method)
    {
        case "PUT": case "POST": case "DELETE": 
        if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("device", JSON.stringify({device: auth.device}));
        break;
    }
    xmlhttp.send(null);
}
export const checkUser = async() =>
{
    request("check", {method: "check", SessionID: window.sessionStorage.getItem("SessionID") as string, username: window.sessionStorage.getItem("username") as string}, (res: {message: string, status: number}, err:{message: string, status: number}) => {
        console.log(res);
        
        if(err) {
            console.log(err);
            if(err.message.toLocaleLowerCase() === "user is not logged in")
            {
                alert("Key und Username ungültig! Bitte melden Sie sich erneut an!");
                window.location.href = "/login.html";
                return false;
            }
        }
        else if(res.status == 200) return true;
        console.log(res);
        
        
    })
}

export const getKey = async (callback: Function) =>
{
    if(window.sessionStorage.getItem("SessionID") != null) return callback(window.sessionStorage.getItem("SessionID")) as string;

    request("auth", {method: "newKey"}, (res: {message: string, status: number}, err:response) => {
        if(err) throw err;
        if(res.status >= 200 && res.status < 300) 
        {
            console.log(res.message);
            
            sessionStorage.setItem("SessionID", res.message);
            return callback(res.message);
        }
        throw ShowError(res.message, res.status);
    });
    return "";
}

export const ShowError = (message: string, code: number = -1) =>
{
    alert(`Es ist folgender Fehler mit dem Code ${code} aufgetreten: \n\n${message}`)
}

export const getEntries = async (auth: {SessionID: string, username: string}) =>
{
    request("getEntries", {method: "getEntries", SessionID: auth.SessionID, username: auth.username}, (res: {message: string, status: number}, err: response) => {
        if(err) throw err;
        try
        {
            let result = JSON.parse(res.message) as response[];
            result.forEach(e => console.log(JSON.parse(e.DATA)));
        }
        catch(e)
        {
            throw new Error(res.message);
        }
    });
};

//Extend the interface with a password property if the method is changepasswd

async function req()
{
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://localhost:5000/auth", false);
    xmlhttp.setRequestHeader("auth", JSON.stringify({type: "RequestKey"}));
    xmlhttp.send();
    return xmlhttp.responseText;
}

const countDevices = async () =>
{

};
const refreshSession = () =>
{
    console.log("Refreshing session");
    const SessionID = window.sessionStorage.getItem("SessionID") as string;
    const username = window.sessionStorage.getItem("username") as string;
    
    if(SessionID && username)
    {
        request("refresh", {method: "refresh", SessionID: SessionID, username: username}, (res: {message: string, status: number}, err: response) => {
            if(err) throw err;
            if(res.status >= 200 && res.status < 300) return true;
            ShowError("Ihre Session ist abgelaufen oder nicht gültig. Bitte neu anmelden", res.status);
        });
    }
}

setInterval(refreshSession, 1000 * 60 * 2);