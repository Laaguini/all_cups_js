import { createHash } from "node:crypto"

export const swapKV = (obj: Record<string | symbol, string | symbol>) => Object.fromEntries(Object.entries(obj).map(e => e.reverse()))

export const zip = (keys: string[], values: any[]): Record<string, any> => Object.fromEntries(keys.map((e, i) => values[i] && [e, values[i]]).filter(t => t))

export const md5 = (data: string) => createHash("md5").update(data).digest("hex")