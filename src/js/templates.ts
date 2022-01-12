import {PCTypen, StatusTypen, PhoneTypen, MonitorTypen, PCHerstellerTypen, MonTypen } from "./values.js";

export const TypSelect = document.createElement('select');
export const HerstellerSelect = document.createElement('select');
export const StatusSelect = document.createElement('select');
export const EquipmentBtn = document.createElement('button');
export const FormSelect = document.createElement('select');



if(document.location.pathname.toLocaleLowerCase().includes('bildschirm'))
{
    MonTypen.forEach(typ => {
        const option = document.createElement('option');
        option.value = typ;
        option.text = typ;
        TypSelect.appendChild(option);
    });

    MonitorTypen.forEach(typ => {
        const option = document.createElement('option');
        option.value = typ;
        option.text = typ;
        HerstellerSelect.appendChild(option);
    });

    (document.getElementById("SelectHerstellerTyp") as HTMLSelectElement).appendChild(HerstellerSelect);

}
else if(document.location.pathname.toLowerCase().includes('/pc'))
{
    PCTypen.forEach(typ => {
        const option = document.createElement('option');
        option.value = typ;
        option.text = typ;
        TypSelect.appendChild(option);
    });

    PCHerstellerTypen.forEach(typ => {
        const option = document.createElement('option');
        option.value = typ;
        option.text = typ;
        HerstellerSelect.appendChild(option);
    });

    (document.getElementById("SelectHerstellerTyp") as HTMLSelectElement).appendChild(HerstellerSelect);

}
else if(document.location.pathname.includes('/Phone'))
{
    PhoneTypen.forEach(typ => {
        const option = document.createElement('option');
        option.value = typ;
        option.text = typ;
        TypSelect.appendChild(option);
    });

}
else if(document.location.pathname.includes('/Konferenz'))
{

}
else
{

}

StatusTypen.forEach(typ => {
    const option = document.createElement('option');
    option.value = typ;
    option.text = typ;
    StatusSelect.appendChild(option);
});

FormSelect.options.add(new Option('Ja', 'Ja'));
FormSelect.options.add(new Option('Nein', 'Nein'));

EquipmentBtn.textContent = "Liste öffnen";