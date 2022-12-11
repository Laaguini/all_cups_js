import { IncomingMessage, ServerResponse, RequestListener } from "node:http"
import { ReadStream } from "node:fs"

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

export type IDatabaseSearchRes<T> = {
    values: T[],
    fields: (fields: (keyof T)[]) => Promise<Partial<T>[]>
}

export interface IDatabase {
    take: (count: number, offset?: number) => Promise<IDatabaseSearchRes<Email>>,
    // takeOne: (offset: number) => Promise<Nullable<Email>>,
    find: (c: Comparator<Email>, limit?: number) => Promise<IDatabaseSearchRes<Email>>,
    // findOne: (c: Comparator<Email>) => Promise<Nullable<Email>>,
}

export type CacheableValue = Object | string

export interface ICache {
    get: (key: string, reserveValue?: CacheableValue) => Promise<any>,
    stream: (key: string, reserveValue?: CacheableValue) => Promise<ReadableStream>,
    set: (key: string, value: CacheableValue) => void,
    clear: (key: string) => void, 
}

export type IControllerCtx = {
    database: IDatabase,
    cache: ICache, 
}

export type ExtendedReq = IncomingMessage & {
    query: Record<string, Nullable<string | string[]>>,
    pathname: Nullable<string>
}

export type ReqWithParams = IncomingMessage & {
    params: Record<string, string>
}

export type ExtendedRes = ServerResponse & {
    json: (data: Object) => string,
    file: (path: string) => ReadStream
}

export type RouteHandler<T> = (ctx: T, req: ExtendedReq & ReqWithParams, res: ExtendedRes) => Promise<string | ReadStream | Buffer> | string | ReadStream

export interface IController<T> {
    on: (path: string, handler: RouteHandler<T>) => void,
    unwrap: (ctx: T) => RequestListener
}

