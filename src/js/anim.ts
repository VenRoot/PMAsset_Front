const btn = document.querySelector('.mobile-menu-button');
const content = document.querySelector('#content');
const sidebar = document.querySelector('.sidebar');
const table = document.getElementById("table") as HTMLTableElement;
export const tbody = document.getElementById('tbody') as HTMLTableElement;
const thead = document.getElementById('thead') as HTMLTableElement;

import { Bildschirm, InputName, PC, PCHersteller } from "./interface";
import { uwu } from "./cart.js";
import { PCHerstellerTypen, PCTypen, StatusTypen } from "./values.js";
import {FormSelect, StatusSelect, TypSelect} from "./templates.js";

uwu();

//add our event listener for the click

console.log("ready");

btn?.addEventListener('click', () => {
    sidebar?.classList.toggle('-ml-64');
});


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
            it_nr: (document.getElementById("itinput")as any).value,
            type: (document.getElementById("SelectInputTyp")as HTMLSelectElement).selectedOptions[0].value as any,
            hersteller: (document.getElementById("SelectHerstellerTyp")as HTMLSelectElement).selectedOptions[0].value as any,
            seriennummer: (document.getElementById("SeriennummerInput")as HTMLInputElement).value,
            // equipment: (document.getElementById("EquipmentInput")as HTMLInputElement).value,
            standort: (document.getElementById("StandortInput")as HTMLInputElement).value,
            status: (document.getElementById("SelectInputStatus")as HTMLSelectElement).selectedOptions[0].value as any,
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
            it_nr: (document.getElementById("itinput")as any).value,
            seriennummer: (document.getElementById("SeriennummerInput")as HTMLInputElement).value,
            hersteller: (document.getElementById("SelectHerstellerTyp")as HTMLSelectElement).selectedOptions[0].value as any,
            status: (document.getElementById("SelectInputStatus")as HTMLSelectElement).selectedOptions[0].value as any,
            standort: (document.getElementById("StandortInput")as HTMLInputElement).value,
            besitzer: (document.getElementById("BesitzerInput")as HTMLInputElement).value,
            form: (document.getElementById("FormSelect")as HTMLSelectElement).selectedOptions[0].value,
            model: (document.getElementById("SelectModel")as HTMLSelectElement).value,
            type: (document.getElementById("SelectInputTyp")as HTMLSelectElement).selectedOptions[0].value as any,
        };
        let values = cells.map((cell, index) => {
            if(index == 0) return (cell.children[0].children[0] as HTMLInputElement).value;
            if(index == 3 || index == 9) return null;
            if(index == 1 || index == 5 || index == 7) return (cell.children[0] as HTMLSelectElement).selectedOptions[0].value;
            if(index == 8 )return (cell.children[1] as HTMLInputElement).value;
            return (cell.children[0] as HTMLInputElement).value;
        });
        console.log(values);
        return bildschirm;
        return values as string[];
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
    const select = document.getElementById("SelectInputTyp") as HTMLSelectElement;
    PCTypen.forEach(element => select.options.add(new Option(element, element)));

    const select2 = document.getElementById("SelectInputStatus") as HTMLSelectElement;
    StatusTypen.forEach(element => select2.options.add(new Option(element, element)));

    const select3 = document.getElementById("SelectHerstellerTyp") as HTMLSelectElement;
    PCHerstellerTypen.forEach(element => select3.options.add(new Option(element, element)));

    Array.prototype.forEach.call(select2.options, function(item: HTMLOptionElement) {
        item.style.textAlignLast = "center";
    })
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

// Grabs all the Elements by their IDs which we had given them
let modal = document.getElementById("my-modal") as HTMLDivElement;

let openbtn = document.getElementById("open-btn") as HTMLButtonElement;

let okbtn = document.getElementById("ok-btn") as HTMLButtonElement;

// We want the modal to open when the Open button is clicked
openbtn.onclick = function () {
    modal.style.display = "block";
}
//We want the modal to close when the OK button is clicked
okbtn.onclick = function () {
    modal.style.display = "none";
}

// The modal will close when the user clicks anywhere outside the modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

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
]

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

SNSearch.addEventListener("keyup", function () {
    let value = this.value.toUpperCase();
    if(value === undefined || value.length <3) return;
    // console.log(value);
    HWSearch.innerHTML = "";
    let result:BSP[] = [];
    if(value.startsWith("IT")) result = BSPDev.filter(element => element.ITNr.startsWith("02-"+value));
    else if(value.startsWith("02-IT")) result = BSPDev.filter(element => element.ITNr.startsWith(value));
    else result = BSPDev.filter(element => element.SN.startsWith(value));
    console.log(result);
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
            DoneBTN.setAttribute("onclick", "PC.AddRow()");
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
        const parent = element.children;
        if(parent == null) return;
        Array.from(parent).forEach(el => {
            if(el.tagName != "INPUT" && el.tagName != "SELECT") return;
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

        switch(i)
        {
            case 1: TypSelect.selectedIndex = PCTypen.indexOf(cell.innerHTML as any);TypSelect.value = cell.innerHTML; cell.innerHTML="";  cell.appendChild(TypSelect); console.log(cell); break;
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
            case 3: break; cell.children[0].classList.add("disabled"); break;
            case 8: cell.children[0].classList.add("disabled"); break;
            case 9: break;
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