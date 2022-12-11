import { derived, writable } from "svelte/store"
import { letter } from "./letters"
import { folder } from "./folders"

const BREAKPOINTS = {
    "lg": 1366,
    "md": 768,
    "sm": -1,
}

export const title = derived([letter, folder], async $val => {
    const l = await $val[0]
    const f = await $val[1]

    if(l) return l.title 
    if(f) return f.name 

    return "Mail UwU"
})

export const pageWidth = writable(window.innerWidth)

export const breakpoint = derived(pageWidth, $pw => Object.entries(BREAKPOINTS).find(e => e[1] < $pw)[0])
