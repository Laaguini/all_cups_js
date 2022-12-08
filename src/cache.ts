import { ICache } from "./types"
import { writeFile, readFile, access } from "node:fs/promises"
import { join } from "node:path"

//Делаю вид что у меня есть Redis 

class Cache implements ICache {
    dir: string

    constructor(dir: string) {
        this.dir = dir
    }

    private async writeIfNotExists(path: string): Promise<void> {
        await access(path).then().catch(async () => await writeFile(path, ""))
    }

    async get(key: string): Promise<any> {
        const path = join(this.dir, key)

        await this.writeIfNotExists(path)

        const value = String(await readFile(path))
        
        try {
            return JSON.parse(value)
        } 
        catch {
            return value
        }
    }

    async set(key: string, value: Object | string) {
        const path = join(this.dir, key)
        writeFile(path, typeof value === "string"? value : JSON.stringify(value))
    }
}

export default Cache