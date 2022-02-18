import { getData } from "./backend.js";
import {autocomplete} from "./ac.js";
import { Item } from "../interface.js";
import { getUsers, tryParseJSON } from "../backend.js";
export const SearchInput = document.getElementById("SearchInput") as HTMLInputElement;
export const ResPC = document.getElementById("ResPC") as HTMLLabelElement;
export const ResBildschirm = document.getElementById("ResBildschirm") as HTMLLabelElement;
export const ResPhone = document.getElementById("ResPhone") as HTMLLabelElement;

const FillSuggestions = async (event: KeyboardEvent) => {
    if(event.keyCode == 13) {
        Search(); return;
    }
    if(SearchInput.value == "") return;
    let Users = await getUsers();
    if(!Users) return;
    let search = SearchInput.value;
    console.log(Users);
    let result = Users.filter(user => user.cn.toLowerCase().includes(search.toLowerCase()) || user.userPrincipalName?.toLowerCase()?.includes(search.toLowerCase()));
}

SearchInput.addEventListener("keyup", FillSuggestions);

export const Search = async () => {

    //Reset all tables
    const tables = document.getElementsByTagName("table");
    for(let i = 0; i < tables.length; i++)
    {
        (tables[i] as HTMLTableElement).innerHTML = "";
    }

    let Users = await getUsers();
    if(!Users) return;
    let search = SearchInput.value;
    let result = Users.find(user => user.cn.toLowerCase().includes(search.toLowerCase()) || user.userPrincipalName?.toLowerCase()?.includes(search.toLowerCase()));
    if(!result) return;  
    console.log(result);
    let data = await getData(result.mail);
    ResPC.innerText = `${data.pcs.length} PCs`;
    ResBildschirm.innerText = `${data.mons.length} Bildschirme`;
    ResPhone.innerText = `${data.phones.length} Telefone`;

    if(data.pcs.length > 0)
    {
        const table = document.getElementById("PCTable") as HTMLTableElement;
        const genTable = MakeTableTemplate(data.pcs[0]);
        table.replaceWith(genTable);
        data.pcs.forEach(device => fillTable(device, genTable));
    }
    else
    {
        const table = document.getElementById("PCTable") as HTMLFormElement;
        const h1 = document.createElement("h1");
        h1.innerHTML = "Keine PCs gefunden";
        table.appendChild(h1);
    }
    if(data.mons.length > 0)
    {
        const table = document.getElementById("MonTable") as HTMLFormElement;
        const genTable = MakeTableTemplate(data.mons[0]);
        table.replaceWith(genTable);
        data.mons.forEach(device => fillTable(device, genTable));
    }
    else
    {
        const table = document.getElementById("MonTable") as HTMLFormElement;
        const h1 = document.createElement("h1");
        h1.innerHTML = "Keine Bildschirme gefunden";
        table.appendChild(h1);
    }
    if(data.phones.length > 0)
    {
        const table = document.getElementById("PhoneTable") as HTMLFormElement;
        const genTable = MakeTableTemplate(data.phones[0]);
        table.replaceWith(genTable);
        data.phones.forEach(device => fillTable(device, genTable));
    }
    else
    {
        const table = document.getElementById("PhoneTable") as HTMLFormElement;
        const h1 = document.createElement("h1");
        h1.innerHTML = "Keine Telefone gefunden";
        table.appendChild(h1);
    }
}


export const checkEnter = (event: KeyboardEvent) => {
    if(event.keyCode == 13) {
        Search();
    }
}

const init = async () => {
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
    autocomplete(SearchInput, mail);
};

setTimeout(init, 1000);



const fillTable = async (device: Item, table: HTMLTableElement) => {
    
    const row = table.insertRow();
    row.classList.add("hover:bg-opacity-50", "border-1", "border-black", "text-black", "duration-500", "transition", "text-center", "dark:text-white", "dark:border-gray-300");
    table.rows.length%2 == 0 ? row.classList.add("bg-gray-200", "dark:bg-gray-600") : row.classList.add("bg-white", "dark:bg-gray-900");

    if(device.kind == "PC")
    {
        const attr = ["it_nr", "type", "seriennummer", "standort", "equipment", "form", "passwort"];
        //Foreach cell in the row in the thead
        for(let i = 0; i < (table.tHead?.children[0] as HTMLTableRowElement).cells.length; i++)
        {
            console.log(attr[i]);
            
            const cell = row.insertCell();
            cell.classList.add("hover:bg-opacity-50", "dark:bg-gray-900", "text-black", "dark:text-white", "dark:border-gray-300");
            //Fill the cell with the value of the device attribute

            if(attr[i] == "equipment")
            {
                //@ts-ignore
                cell.innerHTML = tryParseJSON(device.equipment).join("<br>");
                continue;
            }

            //@ts-ignore
            cell.innerText = device[attr[i]].toString();
        }
    }
    else if(device.kind == "Monitor")
    {
        console.warn(device.attached);
        const attr = ["it_nr", "type", "seriennummer", "model", "standort", "attached"];
        //Foreach cell in the row in the thead
        for(let i = 0; i < (table.tHead?.children[0] as HTMLTableRowElement).cells.length; i++)
        {
            const cell = row.insertCell();
            cell.classList.add("hover:bg-opacity-50", "dark:bg-gray-900", "text-black", "dark:text-white");
            //Fill the cell with the value of the device attribute

            if(attr[i] == "attached")
            {
                //@ts-ignore
                cell.innerHTML = device.attached;
                continue;
            }

            //@ts-ignore
            cell.innerText = device[attr[i]].toString();
        }
    }
    else if(device.kind == "Phone")
    {
        const attr = ["it_nr", "model", "seriennummer", "standort"];
        //Foreach cell in the row in the thead
        for(let i = 0; i < (table.tHead?.children[0] as HTMLTableRowElement).cells.length; i++)
        {
            const cell = row.insertCell();
            cell.classList.add("hover:bg-opacity-50", "dark:bg-gray-900", "text-black", "dark:text-white");
            //Fill the cell with the value of the device attribute
            //@ts-ignore
            cell.innerText = device[attr[i]].toString();
        }
    }
};



const MakeTableTemplate = (device: Item) => {
    const table = document.createElement("table");
    table.classList.add("table", "text-gray-400", "w-full", "border-separate", "space-y-6", "text-sm", "dark:bg-gray-900", "dark:text-white");
    
    const thead = document.createElement("thead");
    thead.classList.add("bg-blue-500", "text-white" ,"dark:bg-gray-900", "dark:text-white");

    const trhead = document.createElement("tr");
    trhead.classList.add("bg-blend-darken", "dark:bg-gray-900", "dark:text-white");
    

    switch(device.kind)
    {
        case "PC":
            table.id = "PCTable";
            const attr1 = ["IT-Nr", "Typ", "Seriennummer", "Standort", "Equipment", "Form", "BIOS Passwort"];
            attr1.forEach(attr => {
                const th = document.createElement("th");
                th.innerText = attr;
                th.classList.add("p-3", "text-center", "dark:bg-gray-900", "dark:text-white");
                trhead.appendChild(th);
            });
            
            break;
        case "Monitor":
            table.id = "MonTable";
            const attr2 = ["IT-Nr", "Typ", "Seriennummer", "Modell", "Standort", "Verknüpft mit"];
            attr2.forEach(attr => {
                const th = document.createElement("th");
                th.innerText = attr;
                th.classList.add("p-3", "text-center", "dark:bg-gray-900", "dark:text-white");
                trhead.appendChild(th);
            });
            break;
        case "Phone":
            table.id = "PhoneTable";
            const attr3 = ["IT-Nr", "Modell", "Seriennummer", "Standort"];
            attr3.forEach(attr => {
                const th = document.createElement("th");
                th.innerText = attr;
                th.classList.add("p-3", "text-center", "dark:bg-gray-900", "dark:text-white");
                trhead.appendChild(th);
            });
            break;
    }
    thead.appendChild(trhead);
    table.appendChild(thead);
    return table;
};