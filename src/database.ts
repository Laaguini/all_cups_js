import fs from "node:fs"
import { Comparator, IDatabase, Email, Nullable } from "./types"

class LocalDatabase implements IDatabase {
    private dataset: Promise<Email[]>

    constructor(path: string) {
        this.dataset = this.import(path)
    }

    private async import(path: string): Promise<Email[]> {
        const dataset = await fs.promises.readFile(path)
        return JSON.parse(dataset.toString("utf-8"))
    }

    async take(count: number, offset: number = 0): Promise<Email[]> {
        return (await this.dataset).slice(offset, offset + count)
    }

    async takeOne(offset: number): Promise<Nullable<Email>> {
        return (await this.dataset)[offset]
    }

    async find(c: Comparator<Email>, limit: number = Infinity): Promise<Email[]> {
        const result: Email[] = []

        for(let e of (await this.dataset)) {
            if(c(e)){
                result.push(e)
                if(result.length === limit) break;
            }
        }

        return result
    }

    async findOne(c: Comparator<Email>): Promise<Nullable<Email>> {
        return (await this.dataset).find(e => c(e))
    }
}

export default LocalDatabase