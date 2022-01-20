const btn = document.querySelector('.mobile-menu-button');
const content = document.querySelector('#content');
const sidebar = document.querySelector('.sidebar');
const table = document.getElementById("table") as HTMLTableElement;
export const tbody = document.getElementById('tbody') as HTMLTableElement;
const thead = document.getElementById('thead') as HTMLTableElement;

import { Bildschirm, InputName, MonTypes, PC, PCHersteller, PCTypes, Status } from "./interface";
import { uwu } from "./cart.js";
import { PCHerstellerTypen, PCTypen, StatusTypen, MonitorTypen, PhoneTypen, MonTypen } from "./values.js";
import {FormSelect, HerstellerSelect, StatusSelect, TypSelect} from "./templates.js";
import { changeCurrentRow, currentRow, GetMonitors } from "./pc/anim.js";

uwu();

//add our event listener for the click

console.log("ready");

btn?.addEventListener('click', () => {
    sidebar?.classList.toggle('-ml-64');
});

//Remove all childs of tbody except the first row
export const ClearTable = () =>
{
    while(tbody.childElementCount > 1)
    {
        tbody.removeChild(tbody.lastElementChild!);
    }
}


export const foc = async (element: HTMLTableRowElement) => {
    for (let j = 0; j < element.cells.length; j++) {
        let cell = element.cells[j];
        if(cell.classList.contains("icons")) continue;
        cell.classList.add('bg-yellow-600');
    }
};

export const unfoc = async (element: HTMLTableRowElement) => {
    for (let j = 0; j < element.cells.length; j++) {
        let cell = element.cells[j];
        if(cell.classList.contains("icons")) continue;
        cell.classList.remove('bg-yellow-600');
    }
}

const newRowNames =
[
    "IT_Nr",
    "Typ",
    "Seriennummer"
];

export const getInputValues = async (type: "PC" | "Bildschirm" | "Phone" | "Konferenz") => 
{
    let inputrow = tbody.rows[0];
    let cells = Array.from(inputrow.cells);

    if(type == "PC")
    {
        //@ts-ignore
        let pc:PC = {
            kind: "PC",
            it_nr: (document.getElementById("itinput") as HTMLInputElement).value as `IT00${number}`,
            type: (document.getElementById("SelectInputTyp")as HTMLSelectElement).selectedOptions[0].value as PCTypes,
            hersteller: (document.getElementById("SelectHerstellerTyp")as HTMLSelectElement).selectedOptions[0].value as PCHersteller,
            seriennummer: (document.getElementById("SeriennummerInput")as HTMLInputElement).value,
            // equipment: (document.getElementById("EquipmentInput")as HTMLInputElement).value,
            standort: (document.getElementById("StandortInput")as HTMLInputElement).value,
            status: (document.getElementById("SelectInputStatus")as HTMLSelectElement).selectedOptions[0].value as Status,
            besitzer: (document.getElementById("BesitzerInput")as HTMLInputElement).value,
            form: (document.getElementById("FormSelect")as HTMLSelectElement).selectedOptions[0].value,
            passwort: (document.getElementById("bpasswd")as HTMLInputElement).value,
        };
        


        // let values = cells.map((cell, index) => {
        //     if(index == 0) return (cell.children[0].children[0] as HTMLInputElement).value;
        //     if(index == 3 || index == 9) return null;
        //     if(index == 1 || index == 5 || index == 7) return (cell.children[0] as HTMLSelectElement).selectedOptions[0].value;
        //     if(index == 8 )return (cell.children[1] as HTMLInputElement).value;
        //     return (cell.children[0] as HTMLInputElement).value;
        // });
        // console.log(values);
        
        return pc;
        // return values as string[];
    }
    else if(type == "Bildschirm")
    {
        let bildschirm:Bildschirm = {
            kind: "Monitor",
            it_nr: (document.getElementById("itinput") as HTMLInputElement).value as `IT00${number}`,
            type: (document.getElementById("SelectInputTyp")as HTMLSelectElement).selectedOptions[0].value as MonTypes,
            hersteller: (document.getElementById("SelectHerstellerTyp")as HTMLSelectElement).selectedOptions[0].value as "Samsung" | "LG" | "Dell",
            seriennummer: (document.getElementById("SeriennummerInput")as HTMLInputElement).value,
            model: (document.getElementById("ModellnummerInput")as HTMLSelectElement).value,
            // attached: (document.getElementById("AttachedInput")as HTMLInputElement).value as any,
            standort: (document.getElementById("StandortInput")as HTMLInputElement).value,
            status: (document.getElementById("SelectInputStatus")as HTMLSelectElement).selectedOptions[0].value as Status,
            besitzer: (document.getElementById("BesitzerInput")as HTMLInputElement).value,
            form: (document.getElementById("FormSelect")as HTMLSelectElement).selectedOptions[0].value,
        };
        // let values = cells.map((cell, index) => {
        //     if(index == 0) return (cell.children[0].children[0] as HTMLInputElement).value;
        //     if(index == 3 || index == 9) return null;
        //     if(index == 1 || index == 5 || index == 7) return (cell.children[0] as HTMLSelectElement).selectedOptions[0].value;
        //     if(index == 8 )return (cell.children[1] as HTMLInputElement).value;
        //     return (cell.children[0] as HTMLInputElement).value;
        // });
        // console.log(values);
        return bildschirm;
        // return values as string[];
    }
    else if(type == "Phone")
    {

    }
    else if(type == "Konferenz")
    {

    }
    
}

export const getEditedValues = async (element: HTMLTableRowElement) =>
{
    let inputrow = element;
    let cells = Array.from(inputrow.cells);
    let values = cells.map((cell, index) => {
        if(index == 0) return (cell.children[0].children[0] as HTMLInputElement).value;
        if(index == 3 || index == 9) return null;
        if(index == 1 || index == 5 || index == 7) return (cell.children[0] as HTMLSelectElement).selectedOptions[0].value;
        if(index == 8 )return (cell.children[1] as HTMLInputElement).value;
        return (cell.children[0] as HTMLInputElement).value;
    });
    return values;
}

//Create a function which returns if the value is odd
const isEven = (i: number) => i % 2 === 0;

const tdRowClasses =
    [
        "border-2",
        "border-black",
        "duration-500",
        "transition",
        "text-center"
    ];

/** Hier wird der Input in eine neue feste Zeile umgewandelt und dem Table hinzugefügt */
const MoveRow = async () => {
    let newrow = document.createElement("tr");
    newrow.setAttribute("onmouseover", "main.foc(this);");
    newrow.setAttribute("onmouseout", "main.unfoc(this);");
    for (let i = 0; i < newRowNames.length; i++) {
        let cell = document.createElement("td");
        tdRowClasses.forEach(element => cell.classList.add(element));
        cell.setAttribute("name", newRowNames[i]);
        
        cell.innerText = getCellValue(i);
        newrow.appendChild(cell);
    }
    for (let i = 0; i < 5; i++) {
        let cell = document.createElement("td");
        cell.classList.add("border-2");
        cell.classList.add("border-black");
        cell.setAttribute("name", "text");
        cell.setAttribute("onfocus", "main.ConvToInput(this);");
        cell.setAttribute("onblur", "main.ConvToCell(this);");
        newrow.appendChild(cell);
    }
    tbody.rows[0] = newrow;
}


const getCellValue = (index: number) => {
    let inputrow = tbody.rows[0];
    let cell = inputrow.cells[index];
    return cell.innerText;
}

(() => {
    if (window.location.href.indexOf("login.html") != -1) return;
    if(window.location.pathname == "/") return;
    const select = document.getElementById("SelectInputTyp") as HTMLSelectElement;
    const Hersteller = document.getElementById("SelectHerstellerTyp") as HTMLSelectElement;
    if(window.location.pathname.toLocaleLowerCase().includes("pc")) PCTypen.forEach(element => select.options.add(new Option(element, element)));
    else if(window.location.pathname.toLocaleLowerCase().includes("bildschirm")) {MonTypen.forEach(element => select.options.add(new Option(element, element))); MonitorTypen.forEach(el => Hersteller.options.add(new Option(el, el))); }
    else if(window.location.pathname.toLocaleLowerCase().includes("phone")) PhoneTypen.forEach(element => select.options.add(new Option(element, element)));
    
    
    const select2 = (document.getElementById("SelectInputStatus") as HTMLSelectElement);
    StatusSelect.id = "SelectInputStatus";
    select2.parentElement!.replaceChild(StatusSelect, select2);
    
    // StatusTypen.forEach(element => select2.options.add(new Option(element, element)));
    
    const select3 = document.getElementById("SelectHerstellerTyp") as HTMLSelectElement;
    HerstellerSelect.id ="SelectHerstellerTyp";
    select3.parentElement!.replaceChild(HerstellerSelect, select3);
    // PCHerstellerTypen.forEach(element => select3.options.add(new Option(element, element)));

    const select4 = document.getElementById("FormSelect") as HTMLSelectElement;
    FormSelect.id = "FormSelect";
    select4.parentElement!.replaceChild(FormSelect, select4);
})();


export const AddEquipment = () => {
    //Show a popup window
    const popup = document.createElement("div") as HTMLDivElement;
    popup.style.display = "block";
    popup.style.opacity = "1";
    popup.style.position = "fixed";
    popup.style.visibility = "visible";
    document.body.appendChild(popup);
};

$("#itinput").keydown(function (e) {
    if (/^\d+$/.test(e.key) == false && e.key != "Backspace") return e.preventDefault();
    let oldvalue = $(this).val() as string;
    let field = this as HTMLInputElement;
    setTimeout(function () {
        if (field.value.indexOf('IT00') !== 0) {
            $(field).val(oldvalue);
        }
    }, 1);
});




//Create a function which will take every HTML Element in the body and apply the "upper" class

setTimeout(() => {
    document.getElementById("DashBtn")?.click();
}, 500);

const DoneBTN = document.getElementById("DoneBTN");

export const enableBtn = () =>
{
    
    if(validateInput()) {
        
        if(DoneBTN != null) 
        {
            DoneBTN.removeAttribute("disabled");
            if(window.location.pathname.toLocaleLowerCase().includes("pc")) DoneBTN.setAttribute("onclick", "PC.AddRow();");
            else if(window.location.pathname.toLocaleLowerCase().includes("bildschirm")) DoneBTN.setAttribute("onclick", "Bildschirm.AddRow();");
            DoneBTN.parentElement?.classList.add("text-green-400");
            DoneBTN.parentElement?.classList.remove("text-red-400");
            DoneBTN.innerHTML = "done";
        }
    }
    else
    {
        //user darf nicht fortfahren
        if(DoneBTN != null) 
        {
            DoneBTN.removeAttribute("onclick");
            DoneBTN.parentElement?.classList.remove("text-green-400");
            DoneBTN.parentElement?.classList.add("text-red-400");
            DoneBTN.innerHTML = "close";
        }
    } 
}

export const ResetFields = () =>
{
    const row = tbody.rows[0];
    //Get all elements with the class "temp" from the row and set their value to ""
    Array.from(row.getElementsByClassName("temp")).forEach(element => {
        if((element as HTMLInputElement).id == "itinput") (element as HTMLInputElement).value = "IT00";
        else (element as HTMLInputElement).value = "";
    });
}

const itinput = document.getElementById("itinput") as HTMLInputElement;

export const validateInput = () =>
{
    if(itinput.value.length != itinput.maxLength) return false;
    let valid = true;
    
    Array.from(tbody.rows[0].cells).forEach(element => {
        const children = element.children;
        if(children == null) return;
        Array.from(children).forEach(el => {
            if(el.tagName != "INPUT" && el.tagName != "SELECT") return;
            if(el.parentElement!.getAttribute("name") == "Attached") return;
            if((el as HTMLInputElement).value == "") valid = false;

        });
    });
    return valid;
}


const keys = {
    ctrl: false,
    shift: false,
    i: false,
    F12: false,
    fuse: false
};

document.onkeydown = (e) =>
{
    if(keys.fuse) return;
    if(e.key == "F12") keys.F12 = true;
    if(e.key === "Control") keys.ctrl = true;
    if(e.key === "Shift") keys.shift = true;
    if(e.key === "I") keys.i = true;

    if(((keys.ctrl && keys.shift && keys.i) || keys.F12) && !keys.fuse)
    {
        console.warn('%cStop!', 'color: red; font-size: 60px; font-weight: bold;');
        console.log("%cFalls dich jemand dazu aufgefordert hat, etwas zu kopieren und hier einzufügen, handelt es sich in 11 von 10 Fällen um einen Betrugsversuch.", 'font-size: 30px; font-weight: bold;');
        console.log("%cEtwas hier einzufügen könnte dazu führen, dass Angreifer möglicherweise mithilfe einer sogenannten Self-XSS-Attacke deine Identität und die Daten stehlen.", 'font-size: 30px; font-weight: bold;');
        keys.fuse = true;
    }
    // console.log(keys);
    
};

document.onkeyup = (e) =>
{
    if(e.key === "Control") keys.ctrl = false;
    if(e.key === "Shift") keys.shift = false;
    if(e.key === "i") keys.i = false;
    if(e.key === "F12") keys.F12 = false;
}


export const EditEntry = (elem: HTMLElement) =>
{

    elem.innerHTML = "done";
    elem.classList.remove("text-yellow-400");
    elem.classList.add("text-green-400");
    elem.setAttribute("onclick", "main.SaveEntry(this)");

    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
    
    Array.from(grandparent.cells).forEach((cell, i) => {
        console.log(cell);
        
        switch(i)
        {
            case 1: cell.innerHTML="";  cell.appendChild(document.getElementById("SelectInputTyp")?.cloneNode(true)!); console.log(cell); break;
            case 4: break; cell.children[0].classList.remove("disabled"); break;
            case 6: StatusSelect.value = cell.innerHTML; cell.innerHTML=""; cell.appendChild(StatusSelect); console.warn(cell); break;
            case 8: FormSelect.value = cell.innerHTML; cell.innerHTML=""; cell.appendChild(FormSelect); break;
            case 9: cell.children[0].removeAttribute("disabled"); (cell.children[0] as HTMLInputElement).type = "text"; break;
            case 10: break;
            default: const inp = document.createElement("input");
            inp.classList.add("text-center") 
            inp.value = cell.innerText; 
            cell.innerHTML = ""; 
            cell.appendChild(inp); 
            break;
        }
    });
}

export const SaveEntry = (elem: HTMLElement) =>
{
    elem.innerHTML = "edit";
    elem.classList.remove("text-green-400");
    elem.classList.add("text-yellow-400");
    elem.setAttribute("onclick", "main.EditEntry(this)");

    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
    
    Array.from(grandparent.cells).forEach((cell, i) => {

        switch(i)
        {
            case 1: case 5: case 7: cell.innerHTML = (cell.children[0] as HTMLSelectElement).value; break;
            //case 3: break; cell.children[0].classList.add("disabled"); break;
            // case 8: cell.children[0].classList.add("disabled"); break;
            case 8: cell.innerHTML = (cell.children[0] as HTMLSelectElement).value; break;
            case 9: cell.children[0].setAttribute("disabled", ""); (cell.children[0] as HTMLInputElement).type = "password"; break;
            case 4: break;
            case 10: break;
            default: cell.innerHTML = (cell.children[0] as HTMLInputElement).value; break;
        }
    });
};

export const DelEntry = (elem: HTMLElement) =>
{
    if(!prompt("Wirklich löschen?")) return;

    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
    grandparent.remove();
}

export const EditColor = () =>
{
    for(let i = 0; i < tbody.rows.length; i++)
    {
        tbody.rows[i].classList.remove("bg-blue-200");
        if(!isEven(i)) tbody.rows[i].classList.add("bg-blue-200");
    }
}

//Check if the user hasn't m