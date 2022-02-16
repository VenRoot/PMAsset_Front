import {ClearTable, enableBtn, foc, getInputValues, ResetFields, tbody} from "../anim.js";
import { PDF } from "../backend.js";
import {Bildschirm, Item, PC} from "../interface";
import { makeToast } from "../toast.js";
import { generatePDF, getData, getMonitors, getPDF, rewritePDF, setData, setEquipment } from "./backend.js";
import { tryParseJSON } from "../backend.js";

const genPasswd = (length: number) =>
{
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890\"\'§$%&/()=\\`´!#-_<>!+~?°^';
    let passwd = "";
    for(let i = 0; i < length; i++)
    {
        passwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return passwd;
}

export const ShowPassword = (elem: HTMLElement) =>
{
    
    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
    const passwd = grandparent.getElementsByClassName("bpasswd")[0] as HTMLInputElement;
    

    if(passwd.type == "password") 
    {
        passwd.type = "text";
        elem.innerHTML = "visibility_off";
        return;
    }
    passwd.type = "password";
    elem.innerHTML = "visibility";
}

export const GeneratePassword = (elem: HTMLElement) =>
{
    const grandparent = elem.parentElement as HTMLTableCellElement;
    const passwd = grandparent.getElementsByTagName("input")[0] as HTMLInputElement;

    passwd.value = genPasswd(15);
    enableBtn();

}

export let devices:PC[] = [];
export const setDevices = (dev:PC[]) => devices = dev; 

export const getDevices = (): PC[] => devices;
export const getDevice = (it_nr: string) =>
{
    return devices.filter(device => device.it_nr.includes(it_nr));
}

export const SearchDevice =(it_nr: string) =>
 {
    const devs = getDevice(it_nr.toLocaleUpperCase());
    console.debug(devs);
    ClearTable();
    devs.forEach(device => AddRow(device));
 }

 const MakeTemplate = async (values: PC): Promise<HTMLTableRowElement> =>
 {


    const template = document.createElement("tr");
    // template.setAttribute("onmouseover", "main.foc(this)");
    // template.setAttribute("onmouseout", "main.unfoc(this)");


    //Make a loop where we clone the template, put the values in and append it to the temp variable
    Object.keys(values).forEach(key =>
    {
        const temp = document.createElement("td");
        temp.classList.add("border-2", "border-black", "duration-500", "transition", "text-center");
        switch(key)
        {
            case "it_nr": temp.innerText = values.it_nr as any; temp.id = "IT_NR"; break;
            case "type": temp.innerText = values.type as any; temp.id="TYP"; break;
            case "hersteller": temp.innerText = values.hersteller as any; temp.id="HERSTELLER"; break;
            case "seriennummer": temp.innerText = values.seriennummer as any; temp.id="SERIENNUMMER"; break;
            case "standort": temp.innerText = values.standort as any; temp.id="STANDORT"; break;
            case "status": temp.innerText = values.status as any; temp.id="STATUS"; break;
            case "equipment": temp.id="EQUIPMENT"; break;
            case "besitzer": 
            const a = document.createElement("a");
            a.href = "#";
            a.classList.add("text-red-900", "hover:text-green-900");
            temp.innerText = values.besitzer as any; 
            temp.id="BESITZER";
            break;
            case "form": temp.innerText = values.form as any; temp.id="FORM";         
            break;
            case "passwort": 
            const pwf = document.createElement("input"); pwf.type = "password"; pwf.disabled = true; pwf.value = values.passwort as any; pwf.classList.add("bpasswd");
            temp.innerHTML = pwf.outerHTML; temp.id="PASSWORT"; break;
        }
        console.debug(temp); 
        
        template.append(temp); 
    });
    console.log(template);
    const sortedtemplate = document.createElement("tr");
    // sortedtemplate.setAttribute("onmouseover", "main.foc(this)");
    // sortedtemplate.setAttribute("onmouseout", "main.unfoc(this)");
    sortedtemplate.classList.add("hover:bg-opacity-50");
    const queries = ["#IT_NR", "#TYP", "#HERSTELLER", "#SERIENNUMMER", "#EQUIPMENT", "#STANDORT", "#STATUS", "#BESITZER", "#FORM", "#PASSWORT"];
    queries.forEach(query => sortedtemplate.appendChild(template.querySelector(query) as HTMLTableCellElement));

    const icons = createIcons();
    sortedtemplate.appendChild(icons);

    return sortedtemplate;
 }

 export const createIcons = () => {
    const icons = document.createElement("td"); icons.classList.add("icons");
    const a1 = document.createElement("a");
    const a2 = document.createElement("a");
    const a3 = document.createElement("a");
    const i1 = document.createElement("i"); i1.classList.add("mx-2");
    const i2 = document.createElement("i"); i2.classList.add("mx-2");
    // const i3 = document.createElement("i");

    a1.classList.add("text-gray-500", "text-gray-500", "hover:text-gray-100"); a1.href = "#";
    a2.classList.add("text-yellow-400",  "hover:text-gray-100", "mx-2"); a2.href = "#";
    a3.classList.add("text-red-400", "hover:text-gray-100"); a3.href = "#";

    i1.classList.add("material-icons-outlined", "text-base"); i1.innerText = "visibility"; i1.setAttribute("onclick", "PC.ShowPassword(this);");
    i2.classList.add("material-icons-outlined", "text-base"); i2.innerText = "edit"; i2.setAttribute("onclick", "main.EditEntry(this);");
    // i3.classList.add("material-icons-round", "text-base"); i3.innerText = "delete_outline";

    a1.appendChild(i1);
    a2.appendChild(i2);
    // a3.appendChild(i3);

    icons.appendChild(a1);
    icons.appendChild(a2);
    icons.appendChild(a3);

    return icons;
 }


 export const AddMonRow = (_values: Bildschirm, currentPC: string) =>
 {
     //PC, der im Hauptmenü ausgewählt wurde
     let pc = devices.find(device => device.it_nr == currentPC);

     let attached: string | null = null;
     let hasAttached = devices.find(device => device.equipment.includes(_values.it_nr) && device.it_nr != currentPC);
     //Prüfe, ob _values in devices.EQUIPMENT vorhanden ist
     
     const MonTBody = document.getElementById("MonTBody") as HTMLTableElement;
     const tr = document.createElement("tr");
     tr.classList.add("HardwareSearchResult");

     const checkbox = document.createElement("td");
     checkbox.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     const checkbox2 = document.createElement("input");
     checkbox2.type = "checkbox";
     checkbox2.classList.add("moncheckbox");

     if(hasAttached) {
        attached = hasAttached.it_nr;
        checkbox2.setAttribute("disabled", "");
        
        //Make the tr look disabled
        tr.classList.add("bg-gray-200", "cursor-not-allowed");
    }

     if(pc && pc.equipment.includes(_values.it_nr)) checkbox2.checked = true;

     checkbox.append(checkbox2);


     let td0 = document.createElement("td"); td0.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td1 = document.createElement("td"); td1.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td2 = document.createElement("td"); td2.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td3 = document.createElement("td"); td3.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td4 = document.createElement("td"); td4.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td5 = document.createElement("td"); td5.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td6 = document.createElement("td"); td6.classList.add("border-t", "border-gray-200", "px-4", "py-2");

     td0.innerText = _values.it_nr;
     td1.innerText = _values.seriennummer;
     td2.innerText = _values.type;
     td3.innerText = _values.hersteller;
     td4.innerText = _values.model;
     td5.innerText = _values.status;
     attached ? td6.innerText = `PC: ${attached}` : td6.innerText = "Nicht verknüpft";
     
     tr.append(checkbox, td0, td1, td2, td3, td4, td5, td6);
     MonTBody.append(tr);
     console.debug(tr);
 }

 export let currentRow = "";
 export const changeCurrentRow = (value: string) =>
 {
        currentRow = value;
 } 

 export const DoneMon = async (saveChanges: boolean) => {
     const tbody = document.getElementById("MonTBody")!;
     const btn = document.createElement("button");
     const Monitors = [];
     btn.id="open-btn"; btn.setAttribute("onclick", "PC.openform(this.parentElement.parentElement)"); btn.classList.add("w-full", "text-center"); btn.innerText = "Hinzufügen"; 
     const row = SearchRowByTdInnerText(currentRow);

     let children: ChildNode;
     switch(currentRow)
     {
         case "input": children = document.getElementById("inputvalues")!.children[4]; break;
         default: 
         //Get the row from the table where the itnr matches and add the input field
         
         if(row == null) return alert("Error");
         children = row.children[4];
     }
     children.textContent = "";
     children.appendChild(btn);

     for(let i = 0; i < tbody.children.length; i++)
     {
         const tr = tbody.children[i];
         const checkbox = tr.children[0].children[0] as HTMLInputElement;
         if(saveChanges && checkbox.checked)
         {
             const id = tr.children[1].innerHTML;
             Monitors.push(id);
             const input = document.createElement("input");
             input.classList.add("readonly", "text-center");
             input.value = id;
             //Right click on the input field, which will prompt the user to remove the input field
            input.setAttribute(`oncontextmenu`, `if(confirm('Möchten Sie diesen Bildschirm vom PC trennen?')) { PC.removeMon(this); this.remove();} return false;`);
            console.debug(currentRow);
            children.appendChild(input);
            children.appendChild(document.createElement("br"));
         }
     }
     setEquipment(currentRow, Monitors)
     return null;
 }

 export const SearchRowByTdInnerText = (value: string) =>
 {
        const tbody = document.getElementById("tbody")!;
        for(let i = 0; i < tbody.children.length; i++)
        {
            const tr = tbody.children[i];
            const td = tr.children[0];
            if(td.textContent?.includes(value) || td.textContent == value)
            {
                return tr as HTMLTableRowElement;
            }
        }
        return null;
 }

 export const removeMon = (input: HTMLInputElement) =>
 {
     const ITNr = input.parentElement!.parentElement!.children[0].innerHTML!;
     if(ITNr.includes("IT"))
     {
            const dev = devices.filter(device => device.it_nr == ITNr);
            if(dev)  
            {
                input.remove();
                setEquipment(ITNr, dev[0].equipment.filter(equipment => equipment != input.value));    
            }
     }
 }

 export const RemoveInputField = (element: HTMLInputElement) => {
     element.remove();
 };

 export const LinkWithPC = async (pcit: string, monit: string) => {

 };

 export const AddRow = async (_values?: PC) =>
{
    // const newRow = tbody.rows[1].cloneNode(true) as HTMLTableRowElement;
    let values:PC;
    
    

    if(!_values)
    {   
        values = await getInputValues("PC") as PC;
        if(devices.filter(e => e.it_nr == values.it_nr).length > 0) return alert("PC ist bereits in der Liste vorhanden!");
        //@ts-ignore
        if(values.equipment === undefined) values.equipment = [];
        //Es wurden keine Values mitgegeben, also... in die DB
        setData(values, {method: "PUT", device: values});
    }
    else values = _values;

    if(!values.equipment) values.equipment = [];
    //@ts-ignore
    if(typeof values.equipment == "string") values.equipment = tryParseJSON(values.equipment);
    console.debug(values);
    const newRow = await MakeTemplate(values);

    //check if count of rows in tbody is even or odd
    const tbody = document.getElementById("tbody")!;
    const count = tbody.children.length;
    if(count % 2 == 0) newRow.classList.add("bg-gray-100");
    else newRow.classList.add("bg-gray-200");
    


    //Set the values into the new row
    Object.keys(values).forEach((key, index) =>
        {
            if(key == "kind") return;
            const template = newRow.getElementsByTagName("td")[index];

            switch(index)
            {
                case 0: template.innerText = values.it_nr as any; break;
                case 1: template.innerText = values.type as any; break;
                case 2: template.innerText = values.hersteller as any; break;
                case 3: template.innerText = values.seriennummer as any; break;
                case 4: 
                const button = document.createElement("button");
                button.id = "open-btn";
                button.setAttribute("onclick","PC.openform(this.parentElement.parentElement);");
                button.classList.add("w-full", "text-center");
                button.innerText = "Hinzufügen";
                template.append(button);

                values.equipment.forEach(equipment =>
                    {
                        const input = document.createElement("input");
                        input.value = equipment;
                        input.classList.add("text-center");
                        input.setAttribute("readonly", "");
                        input.setAttribute("oncontextmenu", "if(confirm('Möchten Sie diesen Bildschirm vom PC trennen?')) { PC.removeMon(this); } return false;");
                        template.append(input);
                        template.append(document.createElement("br"));
                    });
                
                break;
                case 5: template.innerText = values.standort as any; break;
                case 6: template.innerText = values.status as any; break;
                case 7: template.innerText = values.besitzer as any; break;
                case 8: template.innerText = values.form as any; 
                
                //Make a custom contextmenu, which will show several options
                template.addEventListener("contextmenu", e => {
                    //Make a contextmenu and add the options
                    
                    //First, remove the contextmenu if it already exists
                    const _menu = document.getElementById("contextmenu") as HTMLDivElement;
                    if(_menu) _menu.remove();
                    const contextmenu = document.createElement("div");
                    contextmenu.id = "contextmenu";
                    contextmenu.setAttribute("row", values.it_nr);
                    contextmenu.classList.add("bg-gray-100", "text-gray-900", "rounded", "absolute", "z-50", "p-2", "border", "border-gray-400", "text-sm", "font-semibold", "right-0", "top-0", "transform-origin", "center", "transition");
                    const {clientX: mouseX, clientY: mouseY} = e;
                    let options:{option:string, func: string}[] = [];
                    switch(values.form)
                    {
                        case "Ja": options = [{option: "Anzeigen", func: "PDFAnzeigen"}, {option: "Neu erstellen", func: "PDFNeuGenerieren"}, {option: "Entfernen", func: "PDFEntfernen"}, {option: "Mit lokaler PDF überschreiben", func: "AddCustomPDF"}]; break;
                        case "Nein": options = [{option: "Hinzufügen", func: "PDFHinzufuegen"}, {option: "Bereits vorhandene PDF bereitstellen", func: "AddCustomPDF"}]; break;
                    }
                    options.forEach(option =>
                        {
                            const item = document.createElement("div");
                            item.classList.add("item");
                            item.innerText = option.option;
                            item.setAttribute("onclick", `PC.${option.func}("${values.it_nr}");`);
                            contextmenu.append(item);
                        });

                    contextmenu.style.left = `${mouseX}px`; 
                    contextmenu.style.top = `${mouseY}px`;
                    contextmenu.style.backgroundColor = "black";
                    contextmenu.style.color = "white";
                    document.body.append(contextmenu);
                    //Add a listener to the contextmenu, which will remove the contextmenu when clicked
                    contextmenu.addEventListener("click", () => contextmenu.remove());
                    window.addEventListener("click", (e) => {
                        //Check if the clicked element is the contextmenu 
                        if(e.target != contextmenu) contextmenu.remove();
                    });
                    e.preventDefault();
                });
                template.setAttribute("oncontextmenu", `PC.ShowContextMenu(this, "${values.it_nr}");`);
                
                break;
                case 9: (template.children[0] as HTMLInputElement).value = values.passwort as any; break;
            }

        // switch(key)
        // {
        //     case "it_nr": template.innerText = values.it_nr as any; break;
        //     case "type": template.innerText = values.type as any; break;
        //     case "hersteller": template.innerText = values.hersteller as any; break;
        //     case "seriennummer": template.innerText = values.seriennummer as any; break;
        //     case "standort": template.innerText = values.standort as any; break;
        //     case "status": template.innerText = values.status as any; break;
        //     case "besitzer":
        //     const a = document.createElement("a");
        //     a.href = "#";
        //     a.classList.add("text-red-900", "hover:text-green-900");
        //     template.innerText = values.besitzer as any;
        //     break;
        //     case "form": template.innerText = values.form as any; break;
        //     case "passwort": template.innerText = values.passwort as any; break;
        // }
    });
    
    //Add the new row to the table
    $("#tbody tr:first").after(newRow);
    //Reset the values in the input fields
    ResetFields();
    

    
    // if(_values) values = _values;
    // if(values == undefined) return;    
    // Array.from(newRow.cells).forEach(async (cell, index) => {
    //     if(index == 0) cell.innerText = ((values as string[])[index]).slice(3);
    //     else if(index == 3) cell.innerText = "Bildschirm";
    //     else if(index == 6) cell.innerText = values![6];
    //     else if(index == 8) { 
    //         let input = document.createElement("input"); 
    //         input.type = "password";
    //         input.classList.add("bpasswd");
    //         input.value = values![8] || "";
    //         cell.innerHTML = "";
    //         cell.appendChild(input);
    //  }
    //     else if(index == 9) return;
    //     else cell.innerText = values![index];
    // });
};

export const ShowContextMenu = (element: HTMLTableCellElement, itnr: string) =>
{
    const menu = document.createElement("div"); menu.id = "context-menu";
    for(let i = 0; i < 2; i++)
    {
        const item = document.createElement("div");
        item.classList.add("item");
        item.innerText = "Item " + i;
        item.addEventListener("click", () => {
            alert(item.innerText);
        });
        menu.append(item);
    }
    menu.style.display = "block";
    menu.style.left = element.offsetLeft + "px";
    menu.style.top = element.offsetTop + "px";

}

export const PDFAnzeigen = (ITNr: string) =>
{
    getPDF(ITNr);
}

export const PDFHinzufuegen = async (ITNr: string) =>
{
    const username = sessionStorage.getItem("username");
    const key = sessionStorage.getItem("SessionID");
    if(!username || !key) return alert("Bitte loggen Sie sich erneut ein!");
    if(!confirm("PDF aus aktuellen Werten generieren?")) return;
    const device = devices.find(device => device.it_nr == ITNr);
    if(!device) return;

    device.form = "Ja";

    //Update the table
    UpdateTable(device);

    //Generate the PDF
    let res = await generatePDF(device.it_nr);
    if(res.status != 200) return makeToast("Fehler beim Generieren der PDF", "error");
    makeToast("PDF erfolgreich generiert", "success");
    //Update the database
    setData(device, {device: device, method: "POST", username: username, SessionID: key});
}

export const AddCustomPDF = (ITNr: string) => {
    const username = sessionStorage.getItem("username");
    const key = sessionStorage.getItem("SessionID");
    if(!username || !key) return alert("Bitte loggen Sie sich erneut ein!");
    if(!confirm("PDF lokal hochladen? ⚠️ES WIRD KEIN VALUE-CHECK VORGENOMMEN\n(DIE TABELLENDATEN KÖNNTEN VOM PDF-INHALT ABWEICHEN)")) return;
    const device = devices.find(device => device.it_nr == ITNr);
    if(!device) return;

    //Select a pdf file from the computer
    const file = document.createElement("input");
    file.type = "file";
    file.accept = ".pdf";
    file.click();
    file.addEventListener("change", async () => {
        if(!file || file.files == null || file.files[0] == null) return;
        const f = file.files[0];
        if(!f) return;
        const reader = new FileReader();
        reader.readAsBinaryString(f);
        reader.addEventListener("load", async () => {

            device.form = "Ja";
            UpdateTable(device);
            setData(device, {device: device, method: "POST", username: username, SessionID: key});
            let res = await PDF({ITNr: ITNr, method: "POST", SessionID: key, username: username, uploadOwn: true, file: file});

            if(res.status == 200) makeToast("PDF hochgeladen!", "success");
            else makeToast("Fehler beim Hochladen der PDF!", "error");
        });
    });


    
}

export const PDFEntfernen = (ITNr: string) =>
{
    const username = sessionStorage.getItem("username");
    const key = sessionStorage.getItem("SessionID");
    if(!username || !key) return alert("Bitte loggen Sie sich erneut ein!");
    if(!confirm("PDF mit aktuellen Werten entfernen?")) return;
    const device = devices.find(device => device.it_nr == ITNr);
    if(!device) return;

    device.form = "Nein";

    //Update the table
    UpdateTable(device);

    //Update the database
    setData(device, {device: device, method: "POST", username: username, SessionID: key});
}


export const PDFNeuGenerieren = (ITNr: string) =>
{
    const username = sessionStorage.getItem("username");
    const key = sessionStorage.getItem("SessionID");
    if(!username || !key) return alert("Bitte loggen Sie sich erneut ein!");
    if(!confirm("PDF neu generieren?")) return;
    const device = devices.find(device => device.it_nr == ITNr);
    if(!device) return;

    device.form = "Ja";
    //Update the database
    rewritePDF(device.it_nr, (message: string, status: number) => {
        if(status == 200) {
            makeToast("PDF wurde neu generiert!", "success");
            //Update the table
            UpdateTable(device);
        }
        else makeToast(message, "error");
    });
}

export const Notify = (message: string, type: string) =>
{
    const notification = document.createElement("div");
    notification.classList.add("notification", type);
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);	
}

export const UpdateTable = (device: PC) =>
{
    
    const row = Array.from(tbody.rows).find(row => row.cells[0].textContent == device.it_nr);
    if(!row) return;
    Array.from(row.cells).forEach((cell, index) => {
        if(index == 0) cell.innerText = device.it_nr;
        else if(index == 1) cell.innerText = device.type;
        else if(index == 2) cell.innerText = device.hersteller;
        else if(index == 3) cell.innerText = device.seriennummer;
        else if(index == 5) cell.innerText = device.standort;
        else if(index == 6) cell.innerText = device.status;
        else if(index == 7) cell.innerText = device.besitzer;
        else if(index == 8) cell.innerText = device.form;
        else if(index == 9) {
            const ele = document.createElement("input");
            ele.type = "password";
            ele.classList.add("bpasswd");
            ele.value = device.passwort || "";
            cell.innerHTML = "";
            cell.appendChild(ele);
        }
    });
}

//Make a function which gets the Monitors from the backend and log them
export const GetMonitors = async (currentRow: string) =>
{
    document.getElementById("MonTBody")!.innerHTML = "";
    const data = await getMonitors();
    console.debug(data);
    if(!data) return console.debug("Ich geh Mal");
    
    const notAvaiable = ["Bestellt", "Aktiv", "Defekt", "Verschrottet"];
    
    data.forEach(entry =>
    {
        if(notAvaiable.includes(entry.status)) 
        {
            if(entry.status == "Aktiv" && entry.it_nr == currentRow) return AddMonRow(entry, currentRow);
            return;
        }
        AddMonRow(entry, currentRow);
        console.debug(entry);
    });
}


// Grabs all the Elements by their IDs which we had given them
let modal = document.getElementById("my-modal") as HTMLDivElement;

let okbtn = document.getElementById("ok-btn") as HTMLButtonElement;
let cancelbtn = document.getElementById("cancel-btn") as HTMLButtonElement;

export const openform = (row: HTMLTableRowElement) => {

    if(row.children[0]?.children[0]?.children[0]?.hasAttribute("value")) changeCurrentRow((row.children[0]!.children[0]!.children[0]! as HTMLInputElement).value);
    else changeCurrentRow(row.children[0].textContent as string);
    
    
    if(currentRow == "IT00") return alert("Dies IT-Nr ist nicht vollständig");
    GetMonitors(currentRow);
    modal.style.display = "block";
    console.debug(currentRow);
};

//We want the modal to close when the OK button is clicked
export const hideModal =  async function (saveChanges:boolean) {
    
    modal.style.display = "none";
    if(!saveChanges) return;
    await DoneMon(saveChanges);
    let mons: string[] = [];
    //Check if the checkboxes are checked
    Array.prototype.forEach.call(document.getElementsByClassName("moncheckbox"), (element: HTMLInputElement) => {
        if(element.checked)
        {
            const Mon_ITNR = element.parentElement!.parentElement!.children[1].textContent as string;
            mons.push(Mon_ITNR);
        }
        element.checked = false;
    });

    setEquipment(currentRow, mons);
}

// //We want the modal to close when the Cancel button is clicked
// const hideModal = function () {
//     modal.style.display = "none";
//     Array.prototype.forEach.call(document.getElementsByClassName("moncheckbox"), (element: HTMLInputElement) => element.checked = false);
// }

// The modal will close when the user clicks anywhere outside the modal
if(document.location.pathname.toLocaleLowerCase().includes("/pc")) window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const SNSearch = document.getElementById("HardwareSearchInput") as HTMLInputElement;
const HWSearch = document.getElementById("HardwareSearchResult") as HTMLTableRowElement;

const classList =
[
    "border-2",
    "border-black",
    "duration-500",
    "transition",
    "text-center"
];

if(document.location.pathname.toLocaleLowerCase().includes("/pc")) SNSearch.addEventListener("keyup", function () {
    let value = this.value.toUpperCase();
    if(value === undefined || value.length <3) return;
    // console.debug(value);
    HWSearch.innerHTML = "";
    let result:BSP[] = [];
    if(value.startsWith("IT")) result = BSPDev.filter(element => element.ITNr.startsWith("02-"+value));
    else if(value.startsWith("02-IT")) result = BSPDev.filter(element => element.ITNr.startsWith(value));
    else result = BSPDev.filter(element => element.SN.startsWith(value));
    console.debug(result);
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    result.forEach(element => {
        let tr = document.createElement("tr");

        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        let td5 = document.createElement("td");
        let td6 = document.createElement("td");

        td1.innerHTML = checkbox.outerHTML;
        td2.innerText = element.ITNr;
        td3.innerText = element.SN;
        td4.innerText = "Bildschirm";
        td5.innerText = element.Hersteller;
        td6.innerText = element.Status;

        classList.forEach(element => {
            td1.classList.add(element)
            td2.classList.add(element)
            td3.classList.add(element)
            td4.classList.add(element)
            td5.classList.add(element)
            td6.classList.add(element);
        });
        
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

        HWSearch.appendChild(tr);
    });
});

interface BSP {
    ITNr: string;
    SN: string;
    Hersteller: string;
    Status: string;
}

const BSPDev:BSP[] = 
[
    {
        ITNr: "02-IT002021",
        SN: "218737823892",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002022",
        SN: "218737823434",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002023",
        SN: "218737848293",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002024",
        SN: "218737899843",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002025",
        SN: "218737833445",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002026",
        SN: "218737811234",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002027",
        SN: "218737822345",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    }
];