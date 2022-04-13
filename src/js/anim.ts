const btn = document.querySelector('.mobile-menu-button');
const content = document.querySelector('#content');
const sidebar = document.querySelector('.sidebar');
const table = document.getElementById("table") as HTMLTableElement;
export const tbody = document.getElementById('tbody') as HTMLTableElement;
const thead = document.getElementById('thead') as HTMLTableElement;

import { Bildschirm, InputName, Konferenz, KonfHersteller, MonTypes, PC, PCHersteller, PCTypes, Phone, phoneTypes, Status } from "./interface";
import { uwu } from "./cart.js";
import { PCHerstellerTypen, PCTypen, StatusTypen, MonitorTypen, PhoneTypen, MonTypen } from "./values.js";
import {FormSelect, HerstellerSelect, StatusSelect, TypSelect} from "./templates.js";
import { changeCurrentRow, checkMAC, currentRow, getDevice, getDevices, GetMonitors } from "./PC/anim.js";
import { getUsers, ShowError } from "./backend.js";
import { setData } from "./PC/backend.js";
import { autocomplete } from "./MA/ac.js";

uwu();

//add our event listener for the click

console.debug("ready");

btn?.addEventListener('click', () => {
    sidebar?.classList.toggle('-ml-64');
});

//Remove all childs of tbody except the first row
export const ClearTable = async () =>
{
    while(tbody.childElementCount > 1)
    {
        tbody.removeChild(tbody.lastElementChild!);
    }
    Promise.resolve();
}


//Create a function which will highlight the current row
export const foc = (row: HTMLTableRowElement) =>
{
    //row.classList.add('-bg-gray-200');
}

//Create a function which will unfocus the current row
export const unfoc = (row: HTMLTableRowElement) =>
{
    //row.classList.remove('-bg-gray-200');
}


// export const unfoc = async (element: HTMLTableRowElement) => {
//     for (let j = 0; j < element.cells.length; j++) {
//         let cell = element.cells[j];
//         if(cell.classList.contains("icons")) continue;
//         cell.classList.remove('bg-yellow-600');
//     }
// }

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
            it_nr: (document.getElementById("itinput") as HTMLInputElement).value as `${number}`,
            type: (document.getElementById("SelectInputTyp")as HTMLSelectElement).selectedOptions[0].value as PCTypes,
            hersteller: (document.getElementById("SelectHerstellerTyp")as HTMLSelectElement).selectedOptions[0].value as PCHersteller,
            seriennummer: (document.getElementById("SeriennummerInput")as HTMLInputElement).value,
            kommentar: (document.getElementById("bkommentar")as HTMLInputElement).value || "",
            mac: (document.getElementById("macInput")as HTMLInputElement).value || "",
            // equipment: (document.getElementById("EquipmentInput")as HTMLInputElement).value,
            standort: (document.getElementById("StandortInput")as HTMLInputElement).value,
            status: (document.getElementById("SelectInputStatus")as HTMLSelectElement).selectedOptions[0].value as Status,
            besitzer: (document.getElementById("BesitzerInput")as HTMLInputElement).value,
            form: (document.getElementById("FormSelect")as HTMLSelectElement).selectedOptions[0].value,
            passwort: (document.getElementById("bpasswd")as HTMLInputElement).value,
        };
        
        return pc;
        // return values as string[];
    }
    else if(type == "Bildschirm")
    {
        let bildschirm:Bildschirm = {
            kind: "Monitor",
            it_nr: (document.getElementById("itinput") as HTMLInputElement).value as `${number}`,
            type: (document.getElementById("SelectInputTyp")as HTMLSelectElement).selectedOptions[0].value as MonTypes,
            hersteller: (document.getElementById("SelectHerstellerTyp")as HTMLSelectElement).selectedOptions[0].value as "Samsung" | "LG" | "Dell",
            seriennummer: (document.getElementById("SeriennummerInput")as HTMLInputElement).value,
            model: (document.getElementById("ModellnummerInput")as HTMLSelectElement).value,
            // attached: (document.getElementById("AttachedInput")as HTMLInputElement).value as any,
            standort: (document.getElementById("StandortInput")as HTMLInputElement).value,
            status: (document.getElementById("SelectInputStatus")as HTMLSelectElement).selectedOptions[0].value as Status,
            besitzer: (document.getElementById("BesitzerInput")as HTMLInputElement).value,
            // form: (document.getElementById("FormSelect")as HTMLSelectElement).selectedOptions[0].value,
        };
        // let values = cells.map((cell, index) => {
        //     if(index == 0) return (cell.children[0].children[0] as HTMLInputElement).value;
        //     if(index == 3 || index == 9) return null;
        //     if(index == 1 || index == 5 || index == 7) return (cell.children[0] as HTMLSelectElement).selectedOptions[0].value;
        //     if(index == 8 )return (cell.children[1] as HTMLInputElement).value;
        //     return (cell.children[0] as HTMLInputElement).value;
        // });
        // console.debug(values);
        return bildschirm;
        // return values as string[];
    }
    else if(type == "Phone")
    {
        let phone:Phone = {
            kind: "Phone",
            it_nr: (document.getElementById("itinput") as HTMLInputElement).value as `${number}`,
            model: (document.getElementById("SelectInputTyp")as HTMLSelectElement).value as phoneTypes,
            seriennummer: (document.getElementById("SeriennummerInput")as HTMLInputElement).value,
            standort: (document.getElementById("StandortInput")as HTMLInputElement).value,
            status: (document.getElementById("SelectInputStatus")as HTMLSelectElement).selectedOptions[0].value as Status,
            besitzer: (document.getElementById("BesitzerInput")as HTMLInputElement).value,
            // form: (document.getElementById("FormSelect")as HTMLSelectElement).selectedOptions[0].value
        };
        return phone;
    }
    else if(type == "Konferenz")
    {
        let konferenz:Konferenz = {
            kind: "Konferenz",
            it_nr: (document.getElementById("itinput") as HTMLInputElement).value as `${number}`,
            hersteller: (document.getElementById("SelectHerstellerTyp")as HTMLInputElement).value as KonfHersteller,
            model: (document.getElementById("SelectInputTyp")as HTMLInputElement).value as string,
            seriennummer: (document.getElementById("SeriennummerInput")as HTMLInputElement).value,
            standort: (document.getElementById("StandortInput")as HTMLInputElement).value,
            status: (document.getElementById("SelectInputStatus")as HTMLSelectElement).selectedOptions[0].value as Status,
            besitzer: (document.getElementById("BesitzerInput")as HTMLInputElement).value,
            // form: (document.getElementById("FormSelect")as HTMLSelectElement).selectedOptions[0].value
        };
        return konferenz;
    }
    
}

// const getEditedValues = async (element: HTMLTableRowElement) =>
// {
//     let inputrow = element;
//     let cells = Array.from(inputrow.cells);
//     let values = cells.map((cell, index) => {
//         if(index == 0) return (cell.children[0].children[0] as HTMLInputElement).value;
//         if(index == 3 || index == 9) return null;
//         if(index == 1 || index == 5 || index == 7) return (cell.children[0] as HTMLSelectElement).selectedOptions[0].value;
//         if(index == 8 )return (cell.children[1] as HTMLInputElement).value;
//         return (cell.children[0] as HTMLInputElement).value;
//     });
//     return values;
// }

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
        cell.classList.add("border-black dark:border-gray-800");
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

export const AddEquipment = () => {
    //Show a popup window
    const popup = document.createElement("div") as HTMLDivElement;
    popup.style.display = "block";
    popup.style.opacity = "1";
    popup.style.position = "fixed";
    popup.style.visibility = "visible";
    document.body.appendChild(popup);
};

if(document.querySelector("#itinput")) $("#itinput").keydown(function (e) {
console.log(e.keyCode);

    //allowed keys
    if (e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 13 || e.keyCode == 27) return;


    //´ und ` sind nicht erlaubt
    if (e.keyCode == 221 || e.keyCode == 220 || e.keyCode == 229 || e.keyCode == 192) e.preventDefault(); 
    //only accept numbers
    if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8) e.preventDefault();
    //@ts-ignore
    if(($("#itinput").val().length > 3) && e.keyCode != 8) e.preventDefault();


    // if (/^\d+$/.test(e.key) == false && e.key != "Backspace") return e.preventDefault();
    // let oldvalue = $(this).val() as string;
    // let field = this as HTMLInputElement;
    // setTimeout(function () {
    //     if (field.value.indexOf('IT00') !== 0) {
    //         $(field).val(oldvalue);
    //     }
    // }, 1);
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
            else if(window.location.pathname.toLocaleLowerCase().includes("phone")) DoneBTN.setAttribute("onclick", "Phone.AddRow();");
            else if(window.location.pathname.toLocaleLowerCase().includes("konferenz")) DoneBTN.setAttribute("onclick", "Konferenz.AddRow();");
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
        (element as HTMLInputElement).value = "";
    });
}


export const AddCustomTitle = (el: HTMLTableCellElement, values: PC) => {

    // const title = document.createElement("div") as HTMLDivElement;

    // title.oncontextmenu = (e) => title.remove();

    // title.classList.add("text-center", "text-white", "text-sm", "px-2", "py-1", "bg-gray-800", "font-semibold", "rounded-full", "text-xs", "uppercase");
    // title.innerHTML = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum facilis quis excepturi, enim aperiam corporis veniam vitae reprehenderit fuga illum. Illo libero iure mollitia eum alias minus iusto odio dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum facilis quis excepturi, enim aperiam corporis veniam vitae reprehenderit fuga illum. Illo libero iure mollitia eum alias minus iusto odio dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum facilis quis excepturi, enim aperiam corporis veniam vitae reprehenderit fuga illum. Illo libero iure mollitia eum alias minus iusto odio dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum facilis quis excepturi, enim aperiam corporis veniam vitae reprehenderit fuga illum. Illo libero iure mollitia eum alias minus iusto odio dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum facilis quis excepturi, enim aperiam corporis veniam vitae reprehenderit fuga illum. Illo libero iure mollitia eum alias minus iusto odio dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum facilis quis excepturi, enim aperiam corporis veniam vitae reprehenderit fuga illum. Illo libero iure mollitia eum alias minus iusto odio dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum facilis quis excepturi, enim aperiam corporis veniam vitae reprehenderit fuga illum. Illo libero iure mollitia eum alias minus iusto odio dolores.";
    
    // //the title should lay over the page
    // title.style.position = "absolute";

    // //let it appear at the cursor position
    // title.style.top = `${el.offsetTop}px`;
    // title.style.left = `${el.offsetLeft}px`;
    if(values == null) return;
    el.addEventListener("contextmenu", e => {


        //Make a contextmenu and add the options
                    
        //First, remove the contextmenu if it already exists
        const _menu = document.getElementById("contextmenu") as HTMLDivElement;
        if(_menu) _menu.remove();
        const contextmenu = document.createElement("div");
        contextmenu.id = "contextmenu";
        contextmenu.setAttribute("row", values.it_nr);
        contextmenu.classList.add("bg-gray-100", "text-gray-900", "rounded", "absolute", "z-50", "p-2", "border", "border-gray-400", "text-sm", "font-semibold", "right-0", "top-0", "transform-origin", "center", "transition");
        const {clientX: mouseX, clientY: mouseY} = e;

                const item = document.createElement("div");
                item.classList.add("item");
                item.ondblclick = (ev) => SwitchToEditMode(el);
                contextmenu.append(item);
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
    return el;
}


const SwitchToEditMode = (el: HTMLElement) => {
    const ta = document.createElement("textarea");
    el.classList.forEach(x => ta.classList.add(x));
    ta.textContent = el.textContent;
    ta.ondblclick = (ev) => SwitchToViewMode(el);

}

const SwitchToViewMode = (el: HTMLElement) => {
    const ta = document.createElement("div");
    el.classList.forEach(x => ta.classList.add(x));
    ta.textContent = el.textContent;
    ta.ondblclick = (ev) => SwitchToEditMode(el);
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
            if(el.id == "bkommentar") return;
            if(el.tagName != "INPUT" && el.tagName != "SELECT") return;
            if(el.parentElement!.getAttribute("name") == "Attached") return;
            if((el as HTMLInputElement).value == "") valid = false;
            if(el.id == "macInput") 
            {
                if((el as HTMLInputElement).value.length == 0 || (el as HTMLInputElement).value == "-") return;
                if(!checkMAC((el as HTMLInputElement).value)) valid = false;
            }

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
    // console.debug(keys);
    
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
    
    Array.from(grandparent.cells).forEach(async (cell, i) => {
        //console.debug(cell);
        
        switch(i)
        {
            case 1: cell.innerHTML="";  cell.appendChild(document.getElementById("SelectInputTyp")?.cloneNode(true)!); console.debug(cell); break;
            case 5: break; cell.children[0].classList.remove("disabled"); break;
            case 7: StatusSelect.value = cell.innerHTML; cell.innerHTML=""; cell.appendChild(StatusSelect.cloneNode(true)); console.warn(cell); break;
            case 9: break; FormSelect.value = cell.innerHTML; cell.innerHTML=""; cell.appendChild(FormSelect.cloneNode(true)); break;
            case 10: cell.children[0].removeAttribute("disabled"); (cell.children[0] as HTMLInputElement).type = "text"; break;
            case 11: 
            
            if(cell.id == "KOMMENTAR") cell.children[0].removeAttribute("readonly");
            break;
            case 12: break;
            default:
                
            const inp = document.createElement("input");
            
            inp.classList.add("search", "text-center", "bg-transparent", "text-black", "dark:text-gray-300");
            inp.value = cell.innerText; 
            cell.innerHTML = ""; 
            //Autocomplete für Mitarbeiter
            if(i == 7)
            {
                inp.id="SearchInput"
                inp.type="search";
                await init(inp);
            }
            cell.appendChild(inp); 
            break;
        }
    });
}

export const init = async (SearchInput: HTMLInputElement) => {
    if(SearchInput == null) return;
    let Users = await getUsers();
    console.log("OH NO", Users);
    if(!Users) return;

    //reduce user to only cn and mail
    let reducedUsers = Users.map(user => {
        return {
            cn: user.cn,
            mail: user.mail
        }
    });

    console.warn(reducedUsers);
    


    //Put all values from users.cn in an array
    let mail = Users.map(user => user.mail);
    let cn = Users.map(user => user.cn);
    mail.push(...cn);
    mail = mail.filter(x => x);
    console.log("Init Autocomplete");
    autocomplete(SearchInput, mail);
};

setTimeout(() => init((document.getElementById("BesitzerInput") as HTMLInputElement)), 0);

export const SaveEntry = async (elem: HTMLElement) =>
{
    const username = sessionStorage.getItem("username");
    const SessionID = sessionStorage.getItem("SessionID");

    if(username == null || SessionID == null) return ShowError("Du bist nicht eingeloggt!", 401);
    elem.innerHTML = "edit";
    elem.classList.remove("text-green-400");
    elem.classList.add("text-yellow-400");
    elem.setAttribute("onclick", "main.EditEntry(this)");

    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
 
    const device = getDevice((grandparent!.cells[0]!.children[0] as HTMLInputElement).value);
    if(device == null) return ShowError("Das Gerät konnte nicht gefunden werden!", 404);

    

    const dostuff = async () => {
        return new Promise((resolve, reject) => {
            Array.from(grandparent.cells).forEach(async (cell, i) => {
                switch(i)
                    {
                        case 1: case 7: cell.innerHTML = (cell.children[0] as HTMLSelectElement).value; break;
                        case 10: cell.children[0].setAttribute("disabled", ""); (cell.children[0] as HTMLInputElement).type = "password"; break;
                        case 5: case 9: break;
                        case 11:
                            if(cell.id == "KOMMENTAR") cell.children[0].setAttribute("readonly", ""); 
                        resolve(void 0); 
                        break;
                        case 12: break;
                        default: 
                        if(i != 8 && cell.id != "KOMMENTAR") cell.innerHTML = (cell.children[0] as HTMLInputElement).value;
                        else if(i == 8 && cell.id != "KOMMENTAR")
                        {
                            console.log(cell);
                            console.log(cell.children)
                            let value = (cell.children[0] as HTMLInputElement).value;
                            cell.innerHTML = value;
                            //check if value is a mail
                            if(value.includes("@"))
                            {
                                let Users = await getUsers();
                                if(!Users) return resolve(void 0);
                                let newUser = Users.find(user => user.userPrincipalName == value);
                                if(newUser) cell.innerHTML = newUser.cn.split("@")[0];
                                else cell.innerHTML = value.split("@")[0];
                            }
                            else
                            {
                                let Users = await getUsers();
                                if(!Users) return resolve(void 0);
                                let newUser = Users.find(user => user.cn == value);
                                if(newUser) cell.innerHTML = newUser.cn.split("(")[0];
                                else cell.innerHTML = value.split("(")[0];
                            }
                        }
        
                        break;
                    }
            })
        });
        
    };
    await dostuff();
    console.log(grandparent.children[7]);
    let kom: string | null  = "";
    grandparent.children[10].id == "KOMMENTAR" ? kom = (grandparent.children[11].children[0] as HTMLTextAreaElement).value : kom = null;

    
    const newPC:PC =
    {
        kind: "PC",
        it_nr: device.it_nr,
        type: grandparent.children[1].textContent || "" as any,
        hersteller: grandparent.children[2].textContent || "" as any,
        seriennummer: grandparent.children[3].textContent || "" as any,
        mac: grandparent.children[4].textContent || "-" as any,
        equipment: device.equipment,
        standort: grandparent.children[6].textContent || "" as any,
        status: grandparent.children[7].textContent || "" as any,
        besitzer: grandparent.children[8].textContent || "" as any,
        form: device.form,
        check: device.check,
        passwort: (grandparent.children[11].children[0] as HTMLInputElement).value || "" as any,
    }
    console.log(newPC);
    if(kom != null)
    {
        newPC.kommentar = kom;
    }

    //Update the device in the database
    setData(newPC, {device: newPC, method: "POST", SessionID: SessionID, username: username})
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

(() => {
    const el = document.getElementById("itinput") as HTMLInputElement;
    if(!el) return;
    const style = window.getComputedStyle(el, null).getPropertyValue('font-size');
    const fontSize = parseFloat(style);
    const newWidth = el.offsetWidth * 1.5;
})();