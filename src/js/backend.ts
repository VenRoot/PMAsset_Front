export const request = (auth: request, callback: Function) =>
{
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4)
        {
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) callback(JSON.parse(xmlhttp.responseText), null);
            else callback(null, xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", "https://172.18.82.16:5000/"+auth.method, true);
    switch(auth.method)
    {
        case "newKey": xmlhttp.setRequestHeader("auth", JSON.stringify({type: "RequestKey"})); break;

        case "auth": if(!auth.SessionID || !auth.username || !auth.password) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("auth", JSON.stringify({type: "AuthUser", SessionID: auth.SessionID, username: auth.username, password: auth.password}));
        break;

        case "getEntries": if(!auth.SessionID || !auth.username) throw new Error("Missing parameters");
        xmlhttp.setRequestHeader("req", JSON.stringify({SessionID: auth.SessionID, username: auth.username})); break;
    }
    xmlhttp.send(null);
}

export const getKey = async () =>
{
    if(window.sessionStorage.getItem("SessionID") != null) return window.sessionStorage.getItem("SessionID");

    request({method: "newKey"}, (res: {message: string, status: number}, err:response) => {
        if(err) throw err;
        if(res.status >= 200 && res.status < 300) 
        {
            sessionStorage.setItem("SessionID", res.message);
            return res.message;
        }
        else ShowError(res.message, res.status);
    })
}

export const ShowError = (message: string, code: number = -1) =>
{
    alert(`Es ist folgender Fehler mit dem Code ${code} aufgetreten: \n\n${message}`)
}

export const getEntries = async (auth: {SessionID: string, username: string}) =>
{
    let uwu = request({method: "getEntries", SessionID: auth.SessionID, username: auth.username}, (res: {message: string, status: number}, err: response) => {
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

type method = "newKey" | "getEntries" | "auth";

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

