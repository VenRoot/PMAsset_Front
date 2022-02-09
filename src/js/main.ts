import * as anim from "./anim.js";
import {checkUser} from "./backend.js";
export * from "./backend.js";
export * from "./anim.js";

export let DEBUG = true;

console.debug = (...args: any[]) => DEBUG ? console.log(...args) : null;