import { writable, get, derived } from "svelte/store"

const THEMES = ["light", "dark"] as const 

const themeIndex = writable(Number(localStorage.getItem("theme")) ?? ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && 1) || 0))
const theme = derived(themeIndex, $themeIndex => {
    localStorage.setItem("theme", String($themeIndex))
    return THEMES[$themeIndex]
})

const changeTheme = () => themeIndex.set((get(themeIndex) + 1) % THEMES.length)
const setTheme = (i: number) => i < THEMES.length && i >= 0 && themeIndex.set(i)

export { theme, changeTheme, setTheme }