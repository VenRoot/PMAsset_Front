export const darkModeSwitch = document.getElementById("lights-toggle") as HTMLInputElement;
if(!darkModeSwitch) throw new Error("darkModeSwitch not found");
darkModeSwitch.addEventListener("change", (ev) => {
    darkModeSwitch.checked ? darkMode(true) : darkMode(false);
    darkModeSwitch.checked ? localStorage.setItem("theme", "dark") : localStorage.setItem("theme", "light");
});

export const darkMode = (enable: boolean) => (enable ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark"));
export const isDarkMode = () => document.documentElement.classList.contains("dark");

(() => {
    if(localStorage.getItem("theme") === "dark") darkModeSwitch.checked = true;
    else darkModeSwitch.checked = false;
    darkModeSwitch.checked ? darkMode(true) : darkMode(false);
})();

