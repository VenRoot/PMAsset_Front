import {ClearTable, enableBtn, getInputValues, init, ResetFields, tbody} from "../anim.js";
import { getUsers, ShowError } from "../backend.js";
import {Konferenz, Item,} from "../interface";
import { setData } from "./backend.js";

export let devices:Konferenz[] = [];
export const setDevices = async(dev: Konferenz[]) => devices = dev;

export const getDevice = async(it_nr: string) => devices.filter(device => device.it_nr.includes(it_nr));

export const SearchDevice = async(it_nr: string) =>
 {
    const devs = await getDevice(it_nr);
    console.debug(devs);
    ClearTable();
     devs.forEach(device =>AddRow(device));
 }

const MakeTemplate = async(values: Konferenz): Promise<HTMLTableRowElement> =>
{
    const template = document.createElement("tr");
    template.setAttribute("onmouseover", "main.foc(this);");
    template.setAttribute("onmouseout", "main.unfoc(this);");

    Object.keys(values).forEach(key =>
        {
            const temp = document.createElement("td");
            if(key == "kind") return;
            temp.classList.add("border-2", "border-black", "duration-500", "transition", "text-center", "dark:border-white", "dark:text-gray-300", "text-black");
            console.debug(key);
            switch(key)
            {
                case "it_nr": temp.innerText = values.it_nr; temp.id = "IT_NR"; break;
                case "hersteller": temp.innerText = values.hersteller; temp.id = "HERSTELLER"; break;
                case "model": temp.innerText = values.model; temp.id = "MODEL"; break;
                case "seriennummer": temp.innerText = values.seriennummer; temp.id="SERIENNUMMER"; break;
                case "standort": temp.innerText = values.standort; temp.id="STANDORT"; break;
                case "status": temp.innerText = values.status as any; temp.id="STATUS"; break;
                case "besitzer":
                temp.innerText = values.besitzer;
                temp.id="BESITZER";
                break;
                // case "form": temp.innerText = values.form!; temp.id="FORM"; break;
                default: console.error(key, values); break;

            }
            // console.debug(temp);
            //add the td to the tr
            template.appendChild(temp);

        });
        // console.debug(template, template.children);
        const sortedtemplate = document.createElement("tr");
        sortedtemplate.setAttribute("onmouseover", "main.foc(this);");
        sortedtemplate.setAttribute("onmouseout", "main.unfoc(this);");
        const queries = ["#IT_NR", "#HERSTELLER", "#MODEL", "#SERIENNUMMER", "#STANDORT", "#STATUS", "#BESITZER"];
        queries.forEach(query => {
            console.debug(sortedtemplate);
            console.debug(template.querySelector(query));
            console.debug(query);
            if(query == "#ATTACHED" && !template.querySelector(query)) return;
            sortedtemplate.appendChild(template.querySelector(query) as HTMLTableCellElement)
        });
        const icons = createIcons();
        sortedtemplate.appendChild(icons);
        return sortedtemplate;
}

export const createIcons = () => {
    const icons = document.createElement("td"); icons.classList.add("icons");
    const a1 = document.createElement("a");
    const i1 = document.createElement("i"); i1.classList.add("mx-2");
    // const i3 = document.createElement("i");

    a1.classList.add("text-gray-500", "text-gray-500", "hover:text-gray-100"); a1.href = "#";
    i1.classList.add("material-icons-outlined", "text-base"); i1.innerText = "edit"; i1.setAttribute("onclick", "Konferenz.EditEntry(this);");
    a1.appendChild(i1);
    icons.appendChild(a1);
    return icons;
}



export const AddRow = async (_values?: Konferenz) =>
{
    let values:Konferenz;

    if(!_values)
    {
        values = await getInputValues("Konferenz") as Konferenz;
        if(devices.filter(e => e.it_nr == values.it_nr).length > 0) return alert("Diese IT-Nummer existiert bereits!");
        //Es wurden keine Values mitgegeben, also... in die DB
        setData(values, {method: "PUT", device: values});
    }
    else values = _values;
    
    const newRow = await MakeTemplate(values);

    let User = await getUsers();
    if(!User) return ShowError("Fehler beim Laden der Benutzer");
    let newUser = User.find(user => user.userPrincipalName == values.besitzer);
    if(newUser) values.besitzer = newUser.cn.split("(")[0];
    else values.besitzer = values.besitzer.split("@")[0];


    //Set the values into the new row
    Object.keys(values).forEach((key, index) =>
    {
        if(key == "kind") return;
        const template = newRow.getElementsByTagName("td")[index];
        switch(index)
            {
                case 0: template.innerText = values.it_nr; break;
                case 1: template.innerText = values.hersteller; break;
                case 2: template.innerText = values.model; break;
                case 3: template.innerText = values.seriennummer; break;
                case 4: template.innerText = values.standort; break;
                case 5: template.innerText = values.status; break;
                case 6: template.innerText = values.besitzer; break;
                // case 7: template.innerText = values.form; break;
            }
    });
    
    //Add the new row to the table
    $("#tbody tr:first").after(newRow);
    //Reset the values in the input fields
    ResetFields();
}

//ClearTable fuction

export const EditEntry = (elem: HTMLElement) =>
{

    elem.innerHTML = "done";
    elem.classList.remove("text-yellow-400");
    elem.classList.add("text-green-400");
    elem.setAttribute("onclick", "Konferenz.SaveEntry(this)");

    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
    
    Array.from(grandparent.cells).forEach(async(cell, i) => {
        console.debug(cell);
        
        switch(i)
        {
            // case 1: cell.innerHTML="";  cell.appendChild(document.getElementById("SelectHerstellerTyp")?.cloneNode(true)!); console.debug(cell); break;
            // case 4: break; cell.children[0].classList.remove("disabled"); break;
            case 5: cell.innerHTML="";  cell.appendChild(document.getElementById("SelectInputStatus")?.cloneNode(true)!); console.debug(cell); break;
            // case 7: cell.innerHTML="";  cell.appendChild(document.getElementById("FormSelect")?.cloneNode(true)!); console.debug(cell); break;
            case 7: case 0: break;
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
                inp.addEventListener("keyup", async (e) =>
                {
                    if(inp.value == "") return;
                    let Users = await getUsers();
                    if(!Users) return console.error("Users konnten nicht geladen werden");
                    let search = inp.value;
                    console.log(Users);
                    let result = Users.filter(user => user.cn.toLowerCase().includes(search.toLowerCase()) || user.userPrincipalName?.toLowerCase()?.includes(search.toLowerCase()));
                
                });
            }
            cell.appendChild(inp);
            break;
        }
    });
}

export const SaveEntry = async (elem: HTMLElement) =>
{
    const username = sessionStorage.getItem("username");
    const SessionID = sessionStorage.getItem("SessionID");

    if(username == null || SessionID == null) return ShowError("Du bist nicht eingeloggt!", 401);


    elem.innerHTML = "edit";
    elem.classList.remove("text-green-400");
    elem.classList.add("text-yellow-400");
    elem.setAttribute("onclick", "Konferenz.EditEntry(this)");

    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
    
    //@ts-ignore
    const device = PC.devices.find(devs => devs.it_nr == (grandparent.cells[0].children[0] as HTMLInputElement).value);
    if(device == null) return ShowError("Device not found");


    const dostuff = async () => {
        return new Promise((resolve, reject) => {
            Array.from(grandparent.cells).forEach(async (cell, i) => {
                switch(i)
                    {
                        case 0: case 7: break; case 8: cell.innerHTML = (cell.children[0] as HTMLSelectElement).value; break;
                        case 5: cell.innerHTML = (cell.children[0] as HTMLSelectElement).value; break;
                        default: 
                        if(i != 6) cell.innerHTML = (cell.children[0] as HTMLInputElement).value;
                        else if(i == 6)
                        {
                            console.log(cell);
                            console.log(cell.children)
                            let value = (cell.children[0] as HTMLInputElement).value;
                            cell.innerHTML = value;
                            //check if value is a mail
                            if(!value.includes("@"))
                            {
                                let Users = await getUsers();
                                if(!Users) return resolve(void 0);
                                let user = Users.find(user => user.name == value);
                                console.log(user);
                                cell.innerHTML = user?.mail || "Failed";
                            }
                        }
        
                        break;
                    }
            })
        });
        
    };
    await dostuff();
    const konf:Konferenz =
    {
        kind: "Konferenz",
        it_nr: device.it_nr,
        hersteller: grandparent.cells[1].textContent || "" as any,
        model: grandparent.cells[2].textContent || "",
        seriennummer: grandparent.cells[3].textContent || "",
        standort: grandparent.cells[4].textContent || "",
        status: grandparent.cells[5].textContent || "" as any,
        besitzer: grandparent.cells[6].textContent || "" as any
    }
    setData(konf, {device: konf, method: "POST", SessionID: SessionID, username: username});

};

