export const request = (subdomain: string, auth: request, callback: Function) =>
{
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4)
        {
            console.log(xmlhttp);
            
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) callback(JSON.parse(xmlhttp.responseText), null);
            //ERROR
            else callback(null, JSON.parse(xmlhttp.responseText));
        }
    };
    console.log("https://192.168.207.229:5000/"+subdomain);
    xmlhttp.open("GET", "https://192.168.207.229:5000/"+subdomain, true);
    console.log(auth);
    
    switch(auth.method)
    {
        case "newKey": xmlhttp.setRequestHeader("auth", JSON.stringify({type: "RequestKey"})); break;

        case "auth": if(!auth.SessionID || !auth.username || !auth.password) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("auth", JSON.stringify({type: "AuthUser", SessionID: auth.SessionID, username: auth.username, password: auth.password}));
        break;

        case "getEntries": if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("req", JSON.stringify({SessionID: auth.SessionID, username: auth.username})); break;

        case "check": if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("auth", JSON.stringify({type: "check", SessionID: auth.SessionID, username: auth.username})); break;
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
                window.location.href = "login.html";
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
    let uwu = request("getEntries", {method: "getEntries", SessionID: auth.SessionID, username: auth.username}, (res: {message: string, status: number}, err: response) => {
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

export interface response {
    DATA: string;
}

type method = "newKey" | "getEntries" | "auth" | "check";

interface request
{
    method: method;
    SessionID?: string;
    username?: string;
    password?: string;
}

async function req()
{
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://localhost:5000/auth", false);
    xmlhttp.setRequestHeader("auth", JSON.stringify({type: "RequestKey"}));
    xmlhttp.send();
    return xmlhttp.responseText;
}

