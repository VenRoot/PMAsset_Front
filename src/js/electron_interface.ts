import { FSFile } from "./interface"

export interface PDFUploadRec {
    _path: string,
    ITNr: string,
    type: "User" | "Check"
}

export interface PDFUploadSend {
    File: FSFile,
    ITNr: string,
    type: "User" | "Check"
}