

export type InputName = "IT_Nr" | "Typ" | "Seriennummer" | "text";

export type DevTypes = "Tower" | "CAD" | "T30" | "T50" | "T70"  | "T80" | "T90" | "T14";
export type phoneTypes = "iPhone 6" | "iPhone 6S" | "iPhone 6 Plus" | "iPhone 6S Plus" | "iPhone SE" | "iPhone 7" | "iPhone 7 Plus" | "iPhone 7S" | "iPhone 7S Plus" | "iPhone 8" | "iPhone 8 Plus" | "iPhone X" | "iPhone XS" | "iPhone XS Max" | "iPhone XR" | "iPhone 11" | "iPhone 11 Pro" | "iPhone 11 Pro Max" | "iPhone SE 2. Gen" | "iPhone 12" | "iPhone 13" | "iPhone 13 Mini" | "iPhone 13 Pro" | "iPhone 13 Pro Max";
export type MonTypes = "22" | "24" | "27" | "32";
export type MonHersteller = "Samsung" | "LG" | "Dell";

type EquipmentTypes = "Bildschirm" | "Default"; 

export type Status = "Aktiv" | "Inaktiv" | "Bestellt" | "Defekt" | "Reserviert" | "Verschrottet";
export interface equipment
{
    type: EquipmentTypes;

};

type ITNr = `IT${number}`;

export interface Gerät
{
    seriennummer: string;
    it_nr: ITNr;
    status: Status;
    besitzer?: string;
}

export interface PC extends Gerät
{
    type: DevTypes;
}

export interface Bildschirm extends Gerät
{
    type: MonTypes;
    hersteller: "Samsung" | "LG" | "Dell"
    model: string;
}