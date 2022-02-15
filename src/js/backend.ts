import { IPDF, pullrequest, pushrequest, response, User } from "./interface";
import {SERVERADDR} from "./vars.js";



interface reqres {
    message: string,
    status: number
}
export const request = (subdomain: string, auth: pullrequest, optional?: any):Promise<reqres> =>
{
    return new Promise((resolve, reject) => {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4)
            {            
                if (xmlhttp.status >= 200 && xmlhttp.status < 300) resolve(JSON.parse(xmlhttp.responseText));
                //ERROR
                else reject(JSON.parse(xmlhttp.responseText));
            }
        };
        console.debug(SERVERADDR+subdomain);
        xmlhttp.open("GET", SERVERADDR+subdomain, true);

        switch(auth.method)
        {
            case "newKey": xmlhttp.setRequestHeader("auth", JSON.stringify({type: "RequestKey"})); break;

            case "auth": if(!auth.SessionID || !auth.username || !auth.password) throw new Error("Missing parameters");
            xmlhttp.setRequestHeader("auth", JSON.stringify({type: "AuthUser", SessionID: auth.SessionID, username: auth.username, password: auth.password}));
            break;

            case "getEntries": if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
            xmlhttp.setRequestHeader("auth", JSON.stringify({type: "check", SessionID: auth.SessionID, username: auth.username}));
            optional?.mail ? xmlhttp.setRequestHeader("req", JSON.stringify({type: auth.type, Mail: optional.mail})) : xmlhttp.setRequestHeader("req", JSON.stringify({type: auth.type})); break;

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
    });
    
}

export const PDF = (auth: IPDF): Promise<reqres> =>
{
    return new Promise(async (resolve, reject) => {
            const xmlhttp = new XMLHttpRequest();
            
        //push data to the backend
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4)
            {
                    if (xmlhttp.status == 200) 
                    {
                        auth.file ? resolve(JSON.parse(xmlhttp.responseText)) : resolve(xmlhttp.response);
                    }
                    //ERROR
                    else auth.file ? reject(xmlhttp.responseText) : reject(xmlhttp.response);

            }
        };
        auth.file ? xmlhttp.open(auth.method, SERVERADDR+"CustomPDF", true) : xmlhttp.open(auth.method, SERVERADDR+"pdf", true);

        xmlhttp.setRequestHeader("auth", JSON.stringify({SessionID: auth.SessionID, username: auth.username}));
        if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        switch(auth.method)
        {
            case "PUT": case "POST": case "DELETE": case "GET":
            xmlhttp.setRequestHeader("data", JSON.stringify({ITNr: auth.ITNr, type: "PC", own: auth.uploadOwn || false}));
            break;
        }
        if(auth.file)
            {
                const formData = new FormData();
                if(!auth.file.files) throw new Error("Missing file");
                const file = auth.file.files[0];
                formData.append("file", file);
                xmlhttp.setRequestHeader("Content-Size", file.size.toString());
                xmlhttp.send(formData);
            }
        else xmlhttp.send();
        // }
    });

    
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
    xmlhttp.open(auth.method, SERVERADDR+subdomain, true);

    xmlhttp.setRequestHeader("auth", JSON.stringify({SessionID: auth.SessionID, username: auth.username}));
    switch(auth.method)
    {
        case "PUT": case "POST": case "DELETE": 
        if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("device", JSON.stringify(auth.device));
        break;
        default: xmlhttp.abort();
    }
    xmlhttp.send(null);
}
export const checkUser = async() =>
{
    let res = await request("check", {method: "check", SessionID: window.sessionStorage.getItem("SessionID") as string, username: window.sessionStorage.getItem("username") as string}).catch(err => {
        console.error(err);
        if(err.message.toLocaleLowerCase() === "user is not logged in")
            {
                sessionStorage.setItem("redirect", window.location.href);
                alert("Key und Username ungültig! Bitte melden Sie sich erneut an!");
                window.location.href = "/login.html";
                return false;
            }
    });
    if(!res) return false;
    if(res.status == 200) return true;
    return false;
}

async function oo()
{
    Promise.reject(new Error("test")).catch(err => {throw new Error(err.message)}).then(res => {console.log(res)});
}


let Users:User[] = [];
export const getU = (): User[] => Users;

export const getUsers = async () =>
{
    const p1 = performance.now();
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    //@ts-ignore
    if(Users && Users.length > 0) {
        console.log(`Cache took: `, performance.now() - p1);
        //@ts-ignore
        return Users;

    }

    let x = await request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "MA"}).catch(err => {
        if(err) return ShowError(err.message, err.status);
    });
    if(!x) return;
    const users = JSON.parse(x.message);
    Users = users;
    console.log(`Cache took: `, performance.now() - p1);
    return users as unknown as User[];
}


export const getKey = async () =>
{
    if(window.sessionStorage.getItem("SessionID") != null) return window.sessionStorage.getItem("SessionID") as string;

    let res = await request("auth", {method: "newKey"}).catch(err => {Promise.reject(new Error(err))});
    if(!res) throw new Error("No response");
    
    if(res.status >= 200 && res.status < 300) 
    {
        console.debug(res.message);
        sessionStorage.setItem("SessionID", res.message);
        return res.message;
    }
    throw ShowError(res.message, res.status);
}

export const ShowError = (message: string, code: number = -1) =>
{
    alert(`Es ist folgender Fehler mit dem Code ${code} aufgetreten: \n\n${message}`)
}

export const getEntries = async (auth: {SessionID: string, username: string}) =>
{
    const res = await request("getEntries", {method: "getEntries", SessionID: auth.SessionID, username: auth.username}).catch(err => Promise.reject(err));
    try
    {
        let result = JSON.parse(res.message) as response[];
        result.forEach(e => console.debug(JSON.parse(e.DATA)));
    }
    catch(e)
    {
        throw new Error(res.message);
    }
};

//Extend the interface with a password property if the method is changepasswd

async function req()
{
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", SERVERADDR+"auth", false);
    xmlhttp.setRequestHeader("auth", JSON.stringify({type: "RequestKey"}));
    xmlhttp.send();
    return xmlhttp.responseText;
}

const refreshSession = async () =>
{
    console.debug("Refreshing session");
    const SessionID = window.sessionStorage.getItem("SessionID") as string;
    const username = window.sessionStorage.getItem("username") as string;
    
    if(SessionID && username)
    {
        const res = await request("refresh", {method: "refresh", SessionID: SessionID, username: username}).catch(err => Promise.reject(err));
        if(res.status >= 200 && res.status < 300) {
            console.log(new Date().toLocaleString() + ": Session refreshed");
            return true;
        }
        ShowError("Ihre Session ist abgelaufen oder nicht gültig. Bitte neu anmelden", res.status);
    }
}

setInterval(refreshSession, 1000 * 60);