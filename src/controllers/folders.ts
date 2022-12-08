import { ServerResponse } from "node:http"
import { createHash } from "node:crypto"
import { ICache, IDatabase, Email } from "../types";
import { swapKV } from "../utils";

type FoldersControllerOptions = {
    url: string, 
    database: IDatabase, 
    res: ServerResponse,
    cache: ICache
}

const CacheFolderNamesDict = (key: string, cache: ICache, folders: string[]) => {
    const dictEntries = folders.map(e => {
        const hash = createHash('md5')
        return [hash.update(e).digest("hex"), e]
    })

    cache.set(key, Object.fromEntries(dictEntries))
}

const CacheFolder = (key: string, cache: ICache, folder: Email[]) => {
    cache.set(key, JSON.stringify(folder))
}

const FoldersController = async ({url, database, cache, res}: FoldersControllerOptions) => {
    const matches = /\/folders(?:\/([\da-f]+))?(?:\/(\d+))?/g.exec(url)
    if(!matches) return;

    const [_, folderHash, emailId] = matches

    const foldersExists = await cache.get("folders")
    const folderNamesDictExists = await cache.get("folderNamesDict")

    if(!foldersExists){
        const folders = [...new Set(await (await database.take(Infinity)).map(e => e.folder || "Входящие"))]
        await cache.set('folders', folders)
    }
    if(!folderNamesDictExists){ CacheFolderNamesDict("folderNamesDict", cache, await cache.get("folders")) }

    const folders = foldersExists || await cache.get("folders")
    const folderNamesDict = folderNamesDictExists || await cache.get("folderNamesDict")

    if(emailId) {
        const folderCacheExists = await cache.get(`folder-${folderHash}`)
        if(!folderCacheExists) {
            CacheFolder(`folder-${folderHash}`, cache, await database.find(e => e.folder === folderNamesDict[folderHash]))
        }

        return res.write(JSON.stringify(folderCacheExists[emailId] || (await cache.get(`folder-${folderHash}`))[emailId]))
    }

    if(folderHash) {
        if(!folderNamesDict[folderHash]) return

        const folderCacheExists = await cache.get(`folder-${folderHash}`)
        if(!folderCacheExists) {
            CacheFolder(`folder-${folderHash}`, cache, await database.find(e => e.folder === folderNamesDict[folderHash]))
        }

        return res.write(JSON.stringify(folderCacheExists.slice(10) || (await cache.get(`folder-${folderHash}`)).slice(10)))
    }

    return res.write(JSON.stringify(swapKV(folderNamesDict)))
}

export default FoldersController