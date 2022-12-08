import fs from "node:fs"
import { Comparator, IDatabase, Email, Nullable, IDatabaseSearchRes } from "./types"

class DatabaseSearchRes implements IDatabaseSearchRes<Email> {
    values: Email[]

    constructor(e: Email[]) {
        this.values = e
    }

    async fields(fields: (keyof Email)[]) {
        return await this.values.map(v => Object.fromEntries(Object.entries(v).filter(e => fields.includes(<keyof Email>e[0])))) as Partial<Email>[]
    }
}

class LocalDatabase implements IDatabase {
    private dataset: Promise<Email[]>

    constructor(path: string) {
        this.dataset = this.import(path)
    }

    private async import(path: string): Promise<Email[]> {
        const dataset = await fs.promises.readFile(path)
        return JSON.parse(dataset.toString("utf-8"))
    }

    async take(count: number, offset: number = 0): Promise<DatabaseSearchRes> {
        const result = (await this.dataset).slice(offset, offset + count)
        return new DatabaseSearchRes(result)
    }

    async takeOne(offset: number): Promise<Nullable<Email>> {
        return (await this.dataset)[offset]
    }

    async find(c: Comparator<Email>, limit: number = Infinity): Promise<DatabaseSearchRes> {
        const result: Email[] = []

        for(let e of (await this.dataset)) {
            if(c(e)){
                result.push(e)
                if(result.length === limit) break;
            }
        }

        return new DatabaseSearchRes(result)
    }

    async findOne(c: Comparator<Email>): Promise<Nullable<Email>> {
        return (await this.dataset).find(e => c(e))
    }
}

export default LocalDatabase