import { derived, writable, get } from "svelte/store"
import { BASE_URL } from "."
import { folder } from "./folders"
import dayjs from "dayjs"
import type { Email, Nullable } from "../../../types"

const lettersList = derived<Email[]>(folder, async $folder => {
    const slug = $folder?.slug
    if(!slug) return []

    const response = await fetch(`${BASE_URL}/folders/${slug}`)
    const data = await response.json()
    
    return data.map((e, i) => ({...e, id: i}))
})

const letterIndex = writable<Nullable<number>>(null)
const letter = derived<Email>([lettersList, letterIndex], async $val => {
    if($val[1] == null) return null

    const response = await fetch(`${BASE_URL}/folders/${get(folder).slug}/${$val[1]}`)
    const data = await response.json()

    return data
})

const setLetter = (i: number | null) => letterIndex.set(i) 

export { lettersList, letter, letterIndex, setLetter } 
