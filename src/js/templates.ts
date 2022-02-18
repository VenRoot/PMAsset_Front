import { PCTypen, StatusTypen, PhoneTypen, MonitorTypen, PCHerstellerTypen, MonTypen, KonferenzHersteller } from "./values.js";

export const TypSelect = document.createElement('select');
export const HerstellerSelect = document.createElement('select');
export const StatusSelect = document.createElement('select');
export const EquipmentBtn = document.createElement('button');
export const FormSelect = document.createElement('select');

TypSelect.id = "SelectInputTyp";
HerstellerSelect.id = "SelectHerstellerTyp";
StatusSelect.id = "SelectInputStatus";
FormSelect.id = "FormSelect";

TypSelect.classList.add("bg-transparent");
StatusSelect.classList.add("bg-transparent");
HerstellerSelect.classList.add("bg-transparent");
FormSelect.classList.add("bg-transparent");

StatusSelect.style.textAlignLast = "center";
TypSelect.style.textAlignLast = "center";
FormSelect.style.textAlignLast = "center";


//Make the options of TypSelect transparent using tailwind



(() => {
    if(document.location.pathname == "/") return;
    if(document.location.pathname.toLocaleLowerCase().includes("/mitarbeiter")) return;
    if (document.location.pathname.toLocaleLowerCase().includes('bildschirm')) {
        MonTypen.forEach(typ => {
            const option = document.createElement('option');
            option.classList.add("dark:text-white", "dark:bg-gray-900", "text-center");
            option.value = typ;
            option.text = typ;
            TypSelect.appendChild(option);
        });

        MonitorTypen.forEach(typ => {
            const option = document.createElement('option');
            option.classList.add("dark:text-white", "dark:bg-gray-900", "text-center");
            option.value = typ;
            option.text = typ;
            HerstellerSelect.appendChild(option);
        });

        // (document.getElementById("SelectHerstellerTyp")!.innerHTML) = HerstellerSelect.innerHTML;

    }
    else if (document.location.pathname.toLowerCase().includes('/pc')) {
        PCTypen.forEach(typ => {
            const option = document.createElement('option');
            option.classList.add("dark:text-white", "dark:bg-gray-900", "text-center");
            option.value = typ;
            option.text = typ;
            TypSelect.appendChild(option);
        });
        TypSelect.id = "SelectInputTyp";

        PCHerstellerTypen.forEach(typ => {
            const option = document.createElement('option');
            option.classList.add("dark:text-white", "dark:bg-gray-900", "text-center");
            option.value = typ;
            option.text = typ;
            HerstellerSelect.appendChild(option);
        });


    }
    else if (document.location.pathname.toLowerCase().includes('/phone')) {
        PhoneTypen.forEach(typ => {
            const option = document.createElement('option');
            option.classList.add("dark:text-white", "dark:bg-gray-900", "text-center");
            option.value = typ;
            option.text = typ;
            TypSelect.appendChild(option);
        });

    }
    // else if (document.location.pathname.toLocaleLowerCase().includes('/konferenz')) {
    //     KonferenzHersteller.forEach(typ => {
    //         const option = document.createElement('option');
    //         option.classList.add("dark:text-white", "dark:bg-gray-900", "text-center");
    //         option.value = typ;
    //         option.text = typ;
    //         HerstellerSelect.appendChild(option);
    //     });
    // }
    else {

    }

    StatusTypen.forEach(typ => {
        const option = document.createElement('option');
        option.classList.add("dark:text-white", "dark:bg-gray-900", "text-center");
        option.value = typ;
        option.text = typ;
        StatusSelect.appendChild(option);
    });


    const Ja = new Option("Ja", "Ja", true);
    const Nein = new Option("Nein", "Nein");
    Ja.classList.add("dark:text-white", "dark:bg-gray-900", "text-center");
    Nein.classList.add("dark:text-white", "dark:bg-gray-900"), "text-center";

    FormSelect.options.add(Nein);
    FormSelect.options.add(Ja);


    EquipmentBtn.textContent = "Liste öffnen";

    (document.getElementById("SelectInputStatus") as HTMLSelectElement).parentElement!.replaceChild(StatusSelect, document.getElementById("SelectInputStatus")!);
    if(document.location.pathname.toLocaleLowerCase().includes("pc")) (document.getElementById("FormSelect") as HTMLSelectElement).parentElement!.replaceChild(FormSelect, document.getElementById("FormSelect")!);

    if(document.location.pathname.toLocaleLowerCase().includes('konferenz')) return;


    if (!document.location.pathname.toLocaleLowerCase().includes("phone")) document.getElementById("SelectHerstellerTyp")!.parentElement!.replaceChild(HerstellerSelect, (document.getElementById("SelectHerstellerTyp")!));
    (document.getElementById("SelectInputTyp") as HTMLSelectElement).parentElement!.replaceChild(TypSelect, document.getElementById("SelectInputTyp")!);
    
})();