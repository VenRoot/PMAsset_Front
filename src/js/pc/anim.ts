import {enableBtn} from "../anim";

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