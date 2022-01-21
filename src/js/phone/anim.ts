import {ClearTable, enableBtn, getInputValues, ResetFields, tbody} from "../anim.js";
import {Phone, Item,} from "../interface";
import { FormSelect, StatusSelect } from "../templates.js";
import { setData } from "./backend.js";

export let devices:Phone[] = [];
export const setDevices = async(dev: Phone[]) => devices = dev;

export const getDevice = async(it_nr: string) => devices.filter(device => device.it_nr.includes(it_nr));

export const SearchDevice = async(it_nr: string) =>
 {
    const devs = await getDevice(it_nr);
    console.debug(devs);
    ClearTable();
     devs.forEach(device =>AddRow(device));
 }

const MakeTemplate = async(values: Phone): Promise<HTMLTableRowElement> =>
{
    const template = document.createElement("tr");
    template.setAttribute("onmouseover", "main.foc(this);");
    template.setAttribute("onmouseout", "main.unfoc(this);");

    Object.keys(values).forEach(key =>
        {
            const temp = document.createElement("td");
            if(key == "kind") return;
            temp.classList.add("border-2", "border-black", "duration-500", "transition", "text-center");
            console.debug(key);
            switch(key)
            {
                case "it_nr": temp.innerText = values.it_nr; temp.id = "IT_NR"; break;
                case "model": temp.innerText = values.model; temp.id = "MODEL"; break;
                case "seriennummer": temp.innerText = values.seriennummer; temp.id="SERIENNUMMER"; break;
                case "standort": temp.innerText = values.standort; temp.id="STANDORT"; break;
                case "status": temp.innerText = values.status as any; temp.id="STATUS"; break;
                case "besitzer":
                temp.innerText = values.besitzer;
                temp.id="BESITZER";
                break;
                case "form": temp.innerText = values.form!; temp.id="FORM"; break;
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
        const queries = ["#IT_NR","#SERIENNUMMER", "#MODEL", "#STANDORT", "#STATUS", "#BESITZER", "#FORM"];
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
    i1.classList.add("material-icons-outlined", "text-base"); i1.innerText = "edit"; i1.setAttribute("onclick", "Phone.EditEntry(this);");
    a1.appendChild(i1);
    icons.appendChild(a1);
    return icons;
}



export const AddRow = async (_values?: Phone) =>
{
    let values:Phone;

    if(!_values)
    {
        values = await getInputValues("Phone") as Phone;
        if(devices.filter(e => e.it_nr == values.it_nr).length > 0) return alert("Diese IT-Nummer existiert bereits!");
        //Es wurden keine Values mitgegeben, also... in die DB
        setData(values, {method: "PUT", device: values});
    }
    else values = _values;
    
    const newRow = await MakeTemplate(values);
    //Set the values into the new row
    Object.keys(values).forEach((key, index) =>
    {
        if(key == "kind") return;
        const template = newRow.getElementsByTagName("td")[index];
        switch(index)
            {
                case 0: template.innerText = values.it_nr; break;
                case 1: template.innerText = values.model; break;               ;
                case 2: template.innerText = values.seriennummer; break;
                case 3: template.innerText = values.standort; break;
                case 4: template.innerText = values.status; break;
                case 5: template.innerText = values.besitzer; break;
                case 6: template.innerText = values.form; break;
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
    elem.setAttribute("onclick", "Phone.SaveEntry(this)");

    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
    
    Array.from(grandparent.cells).forEach((cell, i) => {
        console.debug(cell);
        
        switch(i)
        {
            case 1: cell.innerHTML="";  cell.appendChild(document.getElementById("SelectInputTyp")?.cloneNode(true)!); console.debug(cell); break;
            case 2: cell.innerHTML="";  cell.appendChild(document.getElementById("SelectHerstellerTyp")?.cloneNode(true)!); console.debug(cell); break;
            // case 4: break; cell.children[0].classList.remove("disabled"); break;
            case 7: StatusSelect.value = cell.innerHTML; cell.innerHTML=""; cell.appendChild(StatusSelect); console.debug(cell); break;
            case 9: FormSelect.value = cell.innerHTML; cell.innerHTML=""; cell.appendChild(FormSelect); break;
            case 10: case 5: break;
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
    elem.setAttribute("onclick", "Phone.EditEntry(this)");

    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
    
    Array.from(grandparent.cells).forEach((cell, i) => {

        switch(i)
        {
            case 1: case 7: cell.innerHTML = (cell.children[0] as HTMLSelectElement).value; break;
            //case 3: break; cell.children[0].classList.add("disabled"); break;
            // case 8: cell.children[0].classList.add("disabled"); break;
            case 8: case 9: cell.innerHTML = (cell.children[0] as HTMLSelectElement).value; break;
            case 9: cell.children[0].setAttribute("disabled", ""); (cell.children[0] as HTMLInputElement).type = "password"; break;
            case 4: cell.innerHTML = (cell.children[0] as HTMLInputElement).value; break;
            case 10: case 5: break;
            default: cell.innerHTML = (cell.children[0] as HTMLInputElement).value; break;
        }
    });
};

