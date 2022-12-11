import { readable, writable, get, derived } from "svelte/store"
import { BASE_URL } from "."
import { Incoming, Important, Sent, Drafts, Archive, Spam, Trash } from "../assets/icons"

type Folder = {
    name: string, 
    icon: string
}

const FOLDERS: Folder[] = [
    {
        name: "Входящие",
        icon: Incoming,
    },
    {
        name: "Важное",
        icon: Important,
    },
    {
        name: "Отправленные",
        icon: Sent,
    },
    {
        name: "Черновики",
        icon: Drafts,
    },
    {
        name: "Архив",
        icon: Archive,
    },
    {
        name: "Спам",
        icon: Spam
    },
    {
        name: "Корзина",
        icon: Trash,
    },
]

const foldersList = readable([], set => {
    fetch(`${BASE_URL}/folders/all`)
    .then(response => response.json())
    .then(data => {
        const folders = FOLDERS.map(f => ({ ...f, slug: data[f.name] }))
        set(folders)
    })
})

const folderIndex = writable(0)
const folder = derived<[], Folder & {slug: string}>([folderIndex, foldersList], $val => get(foldersList)[$val[0]])   
const setFolder = (i: number) => i < FOLDERS.length && i >= 0 && (folderIndex.set(i)) 

export { foldersList, folder, setFolder }