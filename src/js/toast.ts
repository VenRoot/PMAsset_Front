const toasts = document.getElementById("toasts");

export const makeToast = (message: string, type: "success" | "error" | "info" | "warning") => {
    console.log(message);
    if(!toasts) return;
    const toast = document.createElement("div");
    toast.id=`toast-${type}`;
    classList.forEach(className => toast.classList.add(className));
    toast.setAttribute("role", "alert");

    const firstDiv = makeFirstDiv(type);
    const secondDiv = makeSecondDiv(type, message);
    const button = makeButton(type);

    toast.appendChild(firstDiv);
    toast.appendChild(secondDiv);
    toast.appendChild(button);

    // toast.innerHTML = message;
    toasts.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toasts.removeChild(toast);
            }, 500);
        }, 3000);
    }, 100);
};


const classList = ["flex", "items-center", "w-full", "max-w-xs", "p-4", "mb-4", "text-gray-500", "bg-white", "rounded-lg", "shadow", "dark:text-gray-400", "dark:bg-gray-800"];
const childClassList1 = ["inline-flex", "items-center", "justify-center", "flex-shrink-0", "w-8", "h-8", "rounded-lg"];
const childClassList = (color: string) => [...childClassList1, `text-${color}-500`, `bg-${color}-100`, `dark:bg-${color}-800`, `dark:text-${color}-200`];


// const makeFirstDiv = (type: "success" | "error" | "info" | "warning") => {
//     const div = document.createElement("div");
//     div.classList.add(...classList);
//     if(type == "warning")
//     {
//         div.classList.remove("mb-4");
//     }
//     return div;
// }

const makeFirstDiv = (type: "success" | "error" | "info" | "warning") => {
    const div = document.createElement("div");
    div.id = "firstdiv";
    switch(type)
    {
        case "success":
            div.classList.add(...childClassList("green"));
            break;
        case "error":
            div.classList.add(...childClassList("red"));
            break;
        case "info":
            div.classList.add(...childClassList("blue"));
            break;
        case "warning":
            div.classList.add(...childClassList("orange"));
            break;
    }
    

    const makeSVG = (type: "success" | "error" | "info" | "warning") => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttributeNS(null, "stroke", "#ff00");
        path.setAttributeNS(null, "fill-rule", "evenodd");
        path.setAttributeNS(null, "clip-rule", "evenodd");

        svg.setAttributeNS(null, "viewBox", "0 0 20 20");
        switch(type)
        {
            case "success":
                path.setAttributeNS(null, "d", "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z")
            break;
            case "error":
                path.setAttributeNS(null, "d", "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z");
            break;
            case "info":
                path.setAttributeNS(null, "d", "");
            break;
            case "warning":
                path.setAttributeNS(null, "d", "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z");
            break;
            
        }
        
        // svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttributeNS(null, "fill", "#FFFFFF");
        svg.classList.add("w-5", "h-5");
        svg.appendChild(path);
        return svg;
    };

    div.appendChild(makeSVG(type));
    console.log(div);
    return div;
}



const makeSecondDiv = (type: "success" | "error" | "info" | "warning", message: string) => {
    const div = document.createElement("div");
    div.id = "seconddiv";
    div.classList.add("ml-3", "text-sm", "font-normal");
    div.innerHTML = message;
    return div;
}

const makeButton = (type: "success" | "error" | "info" | "warning") => {
    const button = document.createElement("button");
    button.type = "button";
    const cl = [ "ml-auto", "-mx-1.5", "-my-1.5", "bg-white", "text-gray-400", "hover:text-gray-900", "rounded-lg", "focus:ring-2", "focus:ring-gray-300", "p-1.5", "hover:bg-gray-100", "inline-flex", "h-8", "w-8", "dark:text-gray-500", "dark:hover:text-white", "dark:bg-gray-800", "dark:hover:bg-gray-700"]
    button.classList.add(...cl);
    button.setAttribute("data-collapse-toggle", `toast-${type}`);
    button.setAttribute("aria-label", "Close");
    
    


    const makeSpan = () => {
        const span = document.createElement("span");
        span.classList.add("sr-only");
        span.innerHTML = "Close";
        return span;
    }

    const makeSVG = () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const path = document.createElement("path");
        path.setAttribute("stroke", "#ff00");


        svg.classList.add("h-5", "w-5");
        svg.setAttributeNS(null, "fill", "#FFFFFF");
        svg.setAttributeNS(null, "viewBox", "0 0 20 20");
        
        path.setAttributeNS(null, "clip-rule", "evenodd");
        path.setAttributeNS(null, "fill-rule", "evenodd");
        path.setAttributeNS(null, "d", "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z");

        // svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.appendChild(path);
        return svg;
    }

    const span = makeSpan();
    button.appendChild(span);
    button.appendChild(makeSVG());
    return button;
}