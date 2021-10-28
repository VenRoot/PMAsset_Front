import {equipment, types} from "./interfaces";


//grab everything we need
const btn = document.querySelector('.mobile-menu-button');
const sidebar = document.querySelector('.sidebar');
const table = document.getElementById("table") as HTMLTableElement;
const tbody = document.getElementById('tbody') as HTMLTableElement;

//add our event listener for the click

console.log("ready");

btn?.addEventListener('click', () => {
    console.log('clicked');
    sidebar?.classList.toggle('-translate-x-0');
    sidebar?.classList.toggle('md:translate-x-0');
});

const addToTable = (typ: types, sn: string, itnr: string, equipment: equipment, standort: string, status: string) => {
}