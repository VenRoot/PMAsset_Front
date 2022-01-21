import {PCTypen, StatusTypen, PhoneTypen, MonitorTypen, PCHerstellerTypen, MonTypen, KonferenzHersteller } from "./values.js";

export const TypSelect = document.createElement('select');
export const HerstellerSelect = document.createElement('select');
export const StatusSelect = document.createElement('select');
export const EquipmentBtn = document.createElement('button');
export const FormSelect = document.createElement('select');

StatusSelect.style.textAlignLast = "center";
TypSelect.style.textAlignLast = "center";
FormSelect.style.textAlignLast = "center";


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

    // (document.getElementById("SelectHerstellerTyp")!.innerHTML) = HerstellerSelect.innerHTML;

}
else if(document.location.pathname.toLowerCase().includes('/pc'))
{
    PCTypen.forEach(typ => {
        const option = document.createElement('option');
        option.value = typ;
        option.text = typ;
        TypSelect.appendChild(option);
    });
    TypSelect.id = "SelectInputTyp";

    PCHerstellerTypen.forEach(typ => {
        const option = document.createElement('option');
        option.value = typ;
        option.text = typ;
        HerstellerSelect.appendChild(option);
    });

    (document.getElementById("SelectHerstellerTyp") as HTMLSelectElement).appendChild(HerstellerSelect);

}
else if(document.location.pathname.toLowerCase().includes('/phone'))
{
    PhoneTypen.forEach(typ => {
        const option = document.createElement('option');
        option.value = typ;
        option.text = typ;
        TypSelect.appendChild(option);
    });

}
else if(document.location.pathname.toLocaleLowerCase().includes('/konferenz'))
{
    KonferenzHersteller.forEach(typ => {
        const option = document.createElement('option');
        option.value = typ;
        option.text = typ;
        HerstellerSelect.appendChild(option);
    });
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

FormSelect.options.add(new Option('Nein', 'Nein', true));
FormSelect.options.add(new Option('Ja', 'Ja'));

EquipmentBtn.textContent = "Liste öffnen";