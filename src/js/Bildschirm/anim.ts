import {enableBtn, getInputValues, ResetFields, tbody} from "../anim.js";
import {Bildschirm, Item, PC} from "../interface";
import { setData } from "./backend.js";

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



const getDevices = async() =>
{
    const devices:Bildschirm[] = [
        {
            model: "Gallo",
            kind: "Monitor",
            it_nr: "IT002021",
            type: "27",
            hersteller: "LG",
            seriennummer: "473476367843",
            standort: "Aichtal",
            status: "Aktiv",
            besitzer: "Name1 Name2",
            form: "C:\\Users\\Name1\\Desktop\\Form.pdf"           
        },
        {
            kind: "Monitor",
            it_nr: "IT002021",
            type: "32",
            hersteller: "Samsung",
            model: "Dingens",
            seriennummer: "473476367843",
            standort: "Aichtal",
            status: "Aktiv",
            besitzer: "Name1 Name2",
            form: "C:\\Users\\Name1\\Desktop\\Form.pdf"           
        },
        {
            kind: "Monitor",
            it_nr: "IT002021",
            type: "22",
            hersteller: "Samsung",
            model: "Dingens",
            seriennummer: "473476367843",
            standort: "Aichtal",
            status: "Aktiv",
            besitzer: "Name1 Name2",
            form: "C:\\Users\\Name1\\Desktop\\Form.pdf"           
        }
    ]

    return devices;
}

export const getDevice = async(it_nr: string) =>
{
    const devices = await getDevices();
    return devices.filter(device => device.it_nr.includes(it_nr));
}

export const SearchDevice = async(it_nr: string) =>
 {
    const devices = await getDevice(it_nr);
    console.log(devices);
     devices.forEach(device =>AddRow(device));
 }

//  export const AddRow = async (_values?: string[]) =>
// {
//     const newRow = tbody.rows[1].cloneNode(true) as HTMLTableRowElement;
//     let values = await getInputValues("Bildschirm") as Bildschirm;
//     if(_values) values = _values;
//     if(values == undefined) return;
//     console.log(values);
//     Array.from(newRow.cells).forEach(async (cell, index) => {
//         if(index == 0) cell.innerText = values![index].slice(3);
//         else if(index == 3) cell.innerText = "Bildschirm";
//         else if(index == 9) return;
//         else cell.innerText = values![index];
//     });
    
//     $("#tbody tr:first").after(newRow);
//     ResetFields();
// };

export const AddRow = async (_values?: Bildschirm) =>
{
    
    const newRow = tbody.rows[1].cloneNode(true) as HTMLTableRowElement;
    let values = await getInputValues("Bildschirm") as Bildschirm;

    if(!_values)
    {   
        //Es wurden keine Values mitgegeben, also... in die DB
        setData(values, {method: "PUT", device: values});
    }
    //Set the values into the new row
    Object.keys(values).forEach(key =>
    {
        const template = newRow.getElementsByTagName("td")[key as any];
        switch(key)
        {
            case "it_nr": template.innerText = values.it_nr as any; break;
            case "type": template.innerText = values.type as any; break;
            case "hersteller": template.innerText = values.hersteller as any; break;
            case "seriennummer": template.innerText = values.seriennummer as any; break;
            case "standort": template.innerText = values.standort as any; break;
            case "status": template.innerText = values.status as any; break;
            case "besitzer":
            const a = document.createElement("a");
            a.href = "#";
            a.classList.add("text-red-900", "hover:text-green-900");
            template.innerText = values.besitzer as any;
            break;
            case "form": template.innerText = values.form as any; break;
            case "model": template.innerText = values.model as any; break;
        }
    });
    
    //Add the new row to the table
    $("#tbody tr:first").after(newRow);
    //Reset the values in the input fields
    ResetFields();
}