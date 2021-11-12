const btn = document.querySelector('.mobile-menu-button');
const content = document.querySelector('#content');
const sidebar = document.querySelector('.sidebar');
const table = document.getElementById("table") as HTMLTableElement;
const tbody = document.getElementById('tbody') as HTMLTableElement;

import {InputName} from "./interface";

//add our event listener for the click

console.log("ready");

btn?.addEventListener('click', () => {
    console.log('clicked');
    // content?.classList.toggle('-translate-x-0');
    // content?.classList.toggle('md:translate-x-0');



    // sidebar?.classList.toggle('-translate-x-0');
    // sidebar?.classList.toggle('md:translate-x-0');


    sidebar?.classList.toggle('-ml-64');
});


const foc = async (element: HTMLTableRowElement) => {
    for(let j = 0; j < element.cells.length; j++)
    {
        let cell = element.cells[j];
        cell.classList.add('bg-yellow-600');
    }
};

const unfoc = async (element: HTMLTableRowElement) => {
    for(let j = 0; j < element.cells.length; j++)
    {
        let cell = element.cells[j];
        cell.classList.remove('bg-yellow-600');
    }
}

const ConvToInput = async (element: HTMLTableCellElement) => {
    let input = new HTMLInputElement();
    input.type = element.getAttribute("name") || "unknown" as InputName;
    switch(input.type as InputName)
    {
        case "IT_Nr": 
            input.placeholder = "0X-IT00XXXX";
            input.title = "01 => Laptop\n02 => Bildschirm\n03 => Konferenzerät\n04 => Phone";
        break;
        case "Seriennummer": 
            input.placeholder = "XXXXXXXXXXXX";
            input.title = "Bitte hier die Seriennummer eingeben"
        break;
        case "Typ":
            return;
            //Der Typ sollte automatisch gesetzt werden
            let sel = new HTMLSelectElement();
            sel.title = "Bitte hier den Typ auswählen";
            sel.options.add(new Option("Laptop", "01"));
        break;
        case "text": break;
        default: break;
    }
    input.value = element.innerText;
    input.placeholder = ""
    
};

const ConvToCell = async (element: HTMLInputElement) => {
    
};