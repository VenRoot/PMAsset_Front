export type InputName = "IT_Nr" | "Typ" | "Seriennummer" | "text";

export type phoneTypes = "iPhone 6" | "iPhone 6S" | "iPhone 6 Plus" | "iPhone 6S Plus" | "iPhone SE" | "iPhone 7" | "iPhone 7 Plus" | "iPhone 7S" | "iPhone 7S Plus" | "iPhone 8" | "iPhone 8 Plus" | "iPhone X" | "iPhone XS" | "iPhone XS Max" | "iPhone XR" | "iPhone 11" | "iPhone 11 Pro" | "iPhone 11 Pro Max" | "iPhone SE 2. Gen" | "iPhone 12" | "iPhone 13" | "iPhone 13 Mini" | "iPhone 13 Pro" | "iPhone 13 Pro Max";
export type MonTypes = "22" | "24" | "27" | "32";
export type MonHersteller = "Samsung" | "LG" | "Dell";

type EquipmentTypes = "Bildschirm" | "Default"; 

export type Status = "Aktiv" | "Inaktiv" | "Bestellt" | "Defekt" | "Reserviert" | "Verschrottet";

export type PCHersteller = "Haug" | "Lenovo" | "Microsoft"
export type PCTypes = "Tower" | "CAD" | "T430" | "T450" | "T470"  | "T480" | "T490" | "T14";
export interface equipment
{
    type: EquipmentTypes;

};

type ITNr = `IT${"00"}${number}`;

export type Item = PC | Bildschirm | Phone | Konferenz;

export interface Gerät
{
    seriennummer: string;
    it_nr: ITNr;
    status: Status;
    standort: string;
    besitzer: string;
    // form: string;
}


export interface User {
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

export interface PC extends Gerät
{
    kind: "PC";
    equipment: string[];
    type: PCTypes;
    hersteller: PCHersteller;
    passwort: string;
    form: string;
}

export interface Bildschirm extends Gerät
{
    kind: "Monitor";
    type: MonTypes;
    attached?: string;
    hersteller: "Samsung" | "LG" | "Dell"
    model: string;
}

export interface Phone extends Gerät
{
    kind: "Phone";
    model: phoneTypes; 
}
export interface Konferenz extends Gerät
{
    kind: "Konferenz";
    hersteller: KonfHersteller;
    model: string;
}

export type KonfHersteller = "Firma1" | "Firma2";

export interface response {
    DATA: string;
}

type method = "newKey" | "getEntries" | "auth" | "check" | "refresh" | "setMonitors";

export interface pullrequest
{
    method: method;
    type?: "PC" | "Monitor" | "Phone" | "Konferenz" | "ALL" | "MA"; 
    SessionID?: string;
    username?: string;
    password?: string;
}

export interface pushrequest {
    method: "POST" | "PUT" | "DELETE" | "GET";
    SessionID?: string;
    username?: string
    device: Item
}

export interface IPDF
{
    method: "POST" | "GET" | "DELETE" | "PUT";
    SessionID?: string;
    username?: string;
    ITNr: string;
    uploadOwn?: boolean;
    file?: HTMLInputElement;
}