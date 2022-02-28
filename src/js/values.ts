import { PCTypes, phoneTypes, Bildschirm, MonHersteller, Status, PCHersteller, MonTypes, KonfHersteller } from "./interface";

export const PCTypen: PCTypes[] = Object.seal([
    "CAD",
    "T14 G1",
    "T14 G2",
    "T14s G2",
    "T430",
    "T450",
    "T460",
    "T470",
    "T480",
    "T490",
    "Tower",
    "Z-Book",
    "Z-Book Fury"
]);

export const PCHerstellerTypen:PCHersteller[] = Object.seal([
    "Haug",
    "Lenovo",
    "Microsoft",
    "HP"
]);

export const MonTypen:MonTypes[] = Object.seal([
    "22",
    "24",
    "27",
    "32"
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

export const KonferenzHersteller: KonfHersteller[] = Object.seal([
    "Firma1",
    "Firma2"
]);