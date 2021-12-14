import { DevTypes, phoneTypes, Bildschirm, MonHersteller, Status } from "./interface";

export const PCTypen: DevTypes[] = Object.seal([
    "CAD",
    "T14",
    "T430",
    "T450",
    "T470",
    "T480",
    "T490",
    "Tower"
]);

export const StatusTypen: Status[] = Object.seal([
    "Aktiv", 
    "Inaktiv", 
    "Bestellt", 
    "Defekt", 
    "Reserviert", 
    "Verschrottet"
]);

export const PhoneTypen: phoneTypes[] = Object.seal([
    "iPhone 6",
    "iPhone 6S",
    "iPhone 6 Plus",
    "iPhone 6S Plus",
    "iPhone SE",
    "iPhone 7",
    "iPhone 7 Plus",
    "iPhone 7S",
    "iPhone 7S Plus",
    "iPhone 8",
    "iPhone 8 Plus",
    "iPhone X",
    "iPhone XS",
    "iPhone XS Max",
    "iPhone XR",
    "iPhone 11",
    "iPhone 11 Pro",
    "iPhone 11 Pro Max",
    "iPhone SE 2. Gen",
    "iPhone 12",
    "iPhone 13",
    "iPhone 13 Mini",
    "iPhone 13 Pro",
    "iPhone 13 Pro Max"
]);

export const MonitorTypen: MonHersteller[] = Object.seal([
    "Samsung",
    "LG",
    "Dell"
]);

