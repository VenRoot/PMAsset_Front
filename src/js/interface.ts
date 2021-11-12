

export type InputName = "IT_Nr" | "Typ" | "Seriennummer" | "text";

export type DevTypes = "Tower" | "CAD" | "T30" | "T50" | "T70"  | "T80" | "T90" | "T14";

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
    besitzer: string;
}

export interface PC extends Gerät
{
    type: DevTypes;
}

export interface Bildschirm extends Gerät
{
    type: "22" | "24" | "27" | "32";
}