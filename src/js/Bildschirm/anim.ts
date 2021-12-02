import {enableBtn, getInputValues, ResetFields, tbody} from "../anim.js";
import {PC} from "../interface";

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
    const devices:PC[] = [
        {
            it_nr: "IT002021",
            type: "T490",
            seriennummer: "473476367843",
            standort: "Aichtal",
            status: "Aktiv",
            besitzer: "Name1 Name2",
            form: false,
            password: "A8d?s#rc2O~4_Pp"           
        },
        {
            it_nr: "IT002022",
            type: "T490",
            seriennummer: "656756756",
            standort: "Aichtal",
            status: "Aktiv",
            besitzer: "Name3 Name4",
            form: false,
            password: "r^S5\\p3´Tzou0nQ"           
        },
        {
            it_nr: "IT002023",
            type: "T490",
            seriennummer: "35254322323",
            standort: "Aichtal",
            status: "Aktiv",
            besitzer: "Name5 Name6",
            form: true,
            password: "(nB°$imc8X%_§M#"           
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
     devices.forEach(device =>
        {
            AddRow([device.it_nr, device.type, device.seriennummer,"", device.standort, device.status, device.besitzer || "", device.form ? "Ja" : "Nein", device.password]);
        });
 }

 export const AddRow = async (_values?: string[]) =>
{
    const newRow = tbody.rows[1].cloneNode(true) as HTMLTableRowElement;
    let values = await getInputValues("Bildschirm");
    if(_values) values = _values;
    if(values == undefined) return;
    Array.from(newRow.cells).forEach(async (cell, index) => {
        if(index == 0) cell.innerText = ((values as string[])[index]).slice(3);
        if(index == 3) cell.innerText = "Bildschirm";
        if(index == 9) return;
    });
    
    $("#tbody tr:first").after(newRow);
    ResetFields();
};