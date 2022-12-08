import { IncomingMessage, ServerResponse } from "node:http"

export type Nullable<T> = T | undefined | null

export type Base64 = string

export type Document = {
    img: Base64
}

export type User = {
    name: string, 
    surname: string, 
    email: string,
    avatar?: Base64
}

export type Email = {
    author: User,
    to: User[],
    title: string, 
    text: string,
    bookmark: boolean, 
    important: boolean, 
    read: boolean,
    folder: string, 
    date: string,
    doc: Document
}

export type Comparator<T> = (e: T) => boolean

export interface IDatabase {
    take: (count: number, offset?: number) => Promise<Email[]>,
    takeOne: (offset: number) => Promise<Nullable<Email>>,
    find: (c: Comparator<Email>, limit?: number) => Promise<Email[]>,
    findOne: (c: Comparator<Email>) => Promise<Nullable<Email>>,
}

export interface ICache {
    get: (key: string) => Promise<any>,
    set: (key: string, value: Object | string) => void
}

export type IController = (options: any) => (req: IncomingMessage, res: ServerResponse) => void