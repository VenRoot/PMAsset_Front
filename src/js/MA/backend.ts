import { request, ShowError } from "../backend.js";
import { Bildschirm, PC, Phone } from "../interface";
import { PC_res_data, res_monitor } from "../PC/interface";
import { res_phone } from "../phone/interface.js";

interface User {
    "name": string,
    "mail": string,
    "employeeNumber": string,
    "department": string,
    "departmentNumber": string,
    "title": string,
    "telephoneNumber": string,
    "mobile": string,
    "physicalDeliveryOfficeName": string,
    "l": string,
    "st": string,
    "postalCode": string,
    "co": string,
    "userPrincipalName": string,
    "cn": string
};

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
    request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "MA"}, (res:{message:string, status:number}, err: {message: string, status: number}) => {
        if(err)
        {
            ShowError(err.message, err.status);
            throw new Error(err.message);
        }
        const users = JSON.parse(res.message);
        //@ts-ignore
        Users = users;
        console.log(`Request took: `, performance.now() - p1);
        
        return users;
    });
}

interface rr 
{
    pcs: PC[];
    mons: Bildschirm[];
    phones: Phone[];
}

export const getData = async (mail: string):Promise<rr> =>
{
    return new Promise((resolve, reject) => {
        //return a promise with JSON type
    const p1 = performance.now();
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");

    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    if(!mail || mail == "") throw new Error("No mail given");
    const pc: PC[] = [];
    const Mon: Bildschirm[] = [];
    const Ph: Phone[] = [];
    request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "ALL"}, async(res: {message: string, status: number}, err: {message: string, status: number}) => {
        if(err)
        {
            ShowError(err.message, err.status);
            return Promise.reject(new Error(err.message));
        }
        console.debug(res);
        
        console.debug(res.message);
        const {pc, mon, ph, konf} = JSON.parse(res.message);
        console.log(pc, mon, ph, konf);
        console.log(`Request took: `, performance.now() - p1);

        const [pcs, mons, phones] = await Promise.all([ConvToPC(pc), ConvToBS(mon, pc), ConvToPPh(ph)]);
        let obj = {pcs, mons, phones};
        resolve(obj);

    }, {mail: mail});
    });
    
}


const ConvToPC = async (data: PC_res_data[]): Promise<PC[]> =>
{
    const pcr: PC[] = [];
    data.forEach((element) => {
        pcr.push(
            {
                kind: "PC",
                it_nr: element.ITNR as any,
                type: element.TYPE as any,
                hersteller: element.HERSTELLER as any,
                besitzer: element.BESITZER || "",
                seriennummer: element.SN,
                passwort: element.PASSWORT,
                status: element.STATUS as any,
                standort: element.STANDORT,
                form: element.FORM as any,
                equipment: element.EQUIPMENT!                    
            }
        )
    });
    return pcr;
}

const ConvToBS = async (data: res_monitor[], pcs: PC_res_data[]): Promise<Bildschirm[]> =>
{
    const pcr: Bildschirm[] = [];
    data.forEach((element) => {
        console.warn(element);
        
        pcr.push(
            {
                kind: "Monitor",
                it_nr: element.ITNR as any,
                model: element.MODEL as any,
                //find the it_nr in the pcs equipment array
                attached: pcs.find((pc) => pc.EQUIPMENT?.includes(element.ITNR))?.ITNR || "",
                standort: element.STANDORT,
                type: element.TYPE as any,
                hersteller: element.HERSTELLER as any,
                besitzer: element.BESITZER || "",
                seriennummer: element.SN,
                status: element.STATUS as any,
                form: element.FORM as any
            }
        )
    });
    return pcr;
}

const ConvToPPh = async (data: res_phone[]): Promise<Phone[]> =>
{
    const pcr: Phone[] = [];
    data.forEach((element) => {
        pcr.push(
            {
                kind: "Phone",
                it_nr: element.ITNR as any,
                besitzer: element.BESITZER || "",
                seriennummer: element.SN,
                status: element.STATUS as any,
                standort: element.STANDORT,
                form: element.FORM as any,
                model: element.MODEL as any,
            }
        )
    });
    return pcr;
}