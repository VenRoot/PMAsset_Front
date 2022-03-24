import { IPDF, pullrequest, pushrequest, response, User } from "./interface";
import { makeToast } from "./toast.js";
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
                if (xmlhttp.status >= 200 && xmlhttp.status < 300) resolve(tryParseJSON(xmlhttp.responseText));
                //ERROR
                else reject(tryParseJSON(xmlhttp.responseText));
            }
        };
        console.debug(SERVERADDR+subdomain);
        xmlhttp.open("GET", SERVERADDR+subdomain, true);

        switch(auth.method)
        {
            case "newKey": xmlhttp.setRequestHeader("auth", JSON.stringify({type: "RequestKey"})); break;

            case "auth": if(!auth.SessionID || !auth.username || !auth.password) throw new Error("Missing parameters");
            optional.AAD ? xmlhttp.setRequestHeader("auth", JSON.stringify({type: "AuthADUser", SessionID: auth.SessionID, username: auth.username, ADtoken: auth.password}))
                         : xmlhttp.setRequestHeader("auth", JSON.stringify({type: "AuthUser", SessionID: auth.SessionID, username: auth.username, password: auth.password}));
                         
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

export const tryParseJSON = (jsonString: string) =>
{
    try {
        return JSON.parse(jsonString);
    } catch(e) {
        return jsonString;
    }
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
                        auth.file ? resolve(tryParseJSON(xmlhttp.responseText)) : resolve(tryParseJSON(xmlhttp.response));
                        if(auth.method == "GET")
                        {
                            return new Blob([xmlhttp.response], {type: "application/pdf"});
                        }
                    }
                    //ERROR
                    else auth.file ? reject({resText: tryParseJSON(xmlhttp.responseText), status: xmlhttp.status, message: xmlhttp.statusText}) : reject({resText: tryParseJSON(xmlhttp.responseText), status: xmlhttp.status, message: xmlhttp.statusText});

            }
        };
        auth.file ? xmlhttp.open(auth.method, SERVERADDR+"CustomPDF", true) : xmlhttp.open(auth.method, SERVERADDR+"pdf", true);

        xmlhttp.setRequestHeader("auth", JSON.stringify({SessionID: auth.SessionID, username: auth.username}));
        if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        switch(auth.method)
        {
            case "GET":
            xmlhttp.responseType = "blob";

            case "PUT": case "POST": case "DELETE":
            xmlhttp.setRequestHeader("data", JSON.stringify({ITNr: auth.ITNr, type: "PC", own: auth.uploadOwn || false, User: auth.type}))
            break;
        }
        if(auth.file)
            {
                const formData = new FormData();
                let file: File;
                debugger;
                if(auth.file instanceof HTMLInputElement)
                {
                    if(!auth.file.files) throw new Error("Missing file");
                    file = auth.file.files[0];
                }
                else file = auth.file;
                if(!file) throw new Error("Missing file");
                
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
export const insertRequest = (subdomain: string, auth: pushrequest): Promise<{message: string, status: number}> =>
{
    return new Promise(async (resolve, reject) => {
        //Check if auth.device.besitzer is a valid email
        if(auth.device.besitzer.indexOf("@") == -1)
        {
            let u = await getUsers();
            if(!u) return ShowError("Could not get users", 404);
            let user = u.find(x => x.cn == auth.device.besitzer);
            if(user) auth.device.besitzer = user.mail;
            else return ShowError("User wurde nicht gefunden", 404);
        }
        if(auth.device.status == "Bestellt") auth.device.seriennummer = "0";
        if(auth.device.kind == "PC" && auth.device.form.indexOf("|") == -1)
        {
            auth.device.form = `${auth.device.form || "Nein"} | ${auth.device.check || "Nein"}`; 
        }
        const xmlhttp = new XMLHttpRequest();
        //push data to the backend
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4)
            {
                if (xmlhttp.status >= 200 && xmlhttp.status < 300) resolve(tryParseJSON(xmlhttp.responseText));
                //ERROR
                else reject({status: xmlhttp.status, message: xmlhttp.statusText});
            }
        };
        xmlhttp.open(auth.method, SERVERADDR+subdomain, true);

        xmlhttp.setRequestHeader("auth", JSON.stringify({SessionID: auth.SessionID, username: auth.username}));
        switch(auth.method)
        {
            case "PUT": case "POST": case "DELETE": 
            if(!auth.SessionID || !auth.username) reject({message: "Missing parameters", status: 400});
            xmlhttp.setRequestHeader("device", JSON.stringify(auth.device));
            break;
            default: xmlhttp.abort(); reject({status: 400, message: "Invalid method"});
        }
        xmlhttp.send(null);
    });
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
export const setU = (u: User[]) => Users = u;

export const getUsers = ():Promise<User[] | undefined> =>
{
    return new Promise(async (resolve, reject):Promise<User[] | undefined> => {
        const p1 = performance.now();
        const username = window.sessionStorage.getItem("username");
        const SessionID = window.sessionStorage.getItem("SessionID");
        if(username == null || SessionID == null) throw new Error("No SessionID or username found");
        //@ts-ignore
        if(Users && Users.length > 0) {
            console.log(`FAST! Cache took: `, performance.now() - p1);
            console.log(Users);
            //@ts-ignore
            resolve(Users);
            return;
        }

        let x = await request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "MA"}).catch(err => {
            if(err) reject(ShowError(err.message, err.status));
        });
        if(!x) return undefined;
        const users = tryParseJSON(x.message) as User[];
        Users = users;
        console.log(`Cache took: `, performance.now() - p1);
        resolve(users);
    });
    
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
    makeToast(`Es ist folgender Fehler mit dem Code ${code} aufgetreten: \n\n${message}`, "error");
}

export const getEntries = async (auth: {SessionID: string, username: string}) =>
{
    const res = await request("getEntries", {method: "getEntries", SessionID: auth.SessionID, username: auth.username}).catch(err => Promise.reject(err));
    try
    {
        let result = tryParseJSON(res.message) as response[];
        result.forEach(e => console.debug(tryParseJSON(e.DATA)));
    }
    catch(e)
    {
        ShowError(res.message, res.status);
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


export const performanceTest = async () =>
{
    const p0 = performance.now();
    const res = await request("getEntries", {method: "getEntries", SessionID: window.sessionStorage.getItem("SessionID") as string, type: "ALL", username: window.sessionStorage.getItem("username") as string}, {mail: "markus.loeffler@putzmeister.com"}).catch(err => Promise.reject(err));
    const res2 = await request("getEntries", {method: "getEntries", SessionID: window.sessionStorage.getItem("SessionID") as string, type: "MA", username: window.sessionStorage.getItem("username") as string}, {mail: "markus.loeffler@putzmeister.com"}).catch(err => Promise.reject(err));
    const p1 = performance.now();

    const [res3, res4] = await Promise.all([
        request("getEntries", {method: "getEntries", SessionID: window.sessionStorage.getItem("SessionID") as string, type: "ALL", username: window.sessionStorage.getItem("username") as string}, {mail: "markus.loeffler@putzmeister.com"}).catch(err => Promise.reject(err)),
        request("getEntries", {method: "getEntries", SessionID: window.sessionStorage.getItem("SessionID") as string, type: "MA", username: window.sessionStorage.getItem("username") as string}, {mail: "markus.loeffler@putzmeister.com"}).catch(err => Promise.reject(err))
    ]);
    const p2 = performance.now();

    const res5 = await request("getEntries", {method: "getEntries", SessionID: window.sessionStorage.getItem("SessionID") as string, type: "ALLALL", username: window.sessionStorage.getItem("username") as string}, {mail: "markus.loeffler@putzmeister.com"}).catch(err => Promise.reject(err));
    const p3 = performance.now();

    console.log(`2x await: ${p1 - p0}`);
    console.log(`Promise.all: ${p2 - p1}`);
    console.log(`Promise.all + 1 Request: ${p3 - p2}`);
    return [p1 - p0, p2 - p1, p3 - p2];
}

export const Benchmark = async () =>
{
    let perfs = {
        "2x await": 0,
        "Promise.all": 0,
        "Promise.all + 1 Request": 0
    }
    for(let i = 0; i < 100; i++)
    {
        const p = await performanceTest();
        perfs["2x await"] += p[0];
        perfs["Promise.all"] += p[1];
        perfs["Promise.all + 1 Request"] += p[2];
    }
    console.table(perfs);
    return perfs;
}

setInterval(refreshSession, 1000 * 60);