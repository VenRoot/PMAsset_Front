import {PC} from "../interface";

export interface res_data {
    BESITZER: string;
    EQUIPMENT: string[] | null;
    FORM?: string;
    HERSTELLER: string;
    ITNR: string;
    PASSWORT: string;
    SN: string;
    STATUS: string;
    TYPE: string;
    STANDORT: string;
}

export interface res_monitor
{
    ITNR: string;
    SN: string;
    HERSTELLER: string;
    TYPE: string;
    STATUS: string;
    BESITZER: string;
    MODEL: string;
    FORM: string;
}