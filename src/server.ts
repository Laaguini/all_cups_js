import { App } from "./server/app.js";
import LocalDatabase from "./server/database.js";
import { Controller, ControllerCtx } from "./server/controller.js";
import Cache from "./server/cache.js";
import { md5 } from "./utils.js";
import { createReadStream } from "node:fs";
import { access, readFile } from "node:fs/promises"

const controller = new Controller()

const createFolderAliases = async (ctx: ControllerCtx): Promise<Record<string, string>> => {
    const folders = [ ...new Set((await ctx.database.take(Infinity)).values.map(e => e.folder)) ]

    return Object.fromEntries(folders.map(f => [f ?? 'Входящие', md5(String(f))]))
}

controller.on('/api/folders/all', async (ctx, req, res) => {
    return res.json(await createFolderAliases(ctx))
})

controller.on('/api/folders/:folder', async (ctx, req, res) => {
    const folderAliases = await createFolderAliases(ctx)

    const emails = (await ctx.database.find(e => folderAliases[e.folder ?? 'Входящие'] === req.params.folder)).values.map(e => ({ 
        ...e, 
        doc: Boolean(e?.doc), 
        to: e.to.map(t => ({ ...t, avatar: '' })) 
    }))

    return res.json(emails.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)))
})

controller.on('/api/folders/:folder/:email', async (ctx, req, res) => {
    const folderAliases = await createFolderAliases(ctx)

    const emails = (await ctx.database.find(e => folderAliases[e.folder ?? 'Входящие'] === req.params.folder)).values

    return res.json(emails.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[Number(req.params.email)])
})

controller.on('/', async (ctx, req, res) => {
    const file = await readFile("./index.html")
    
    return file
})

controller.on('/assets/:filename', async (ctx, req, res) => {
    const path = `./assets/${req.params.filename}`
    const ext = req.params.filename.slice(req.params.filename.lastIndexOf('.'))
    let flag;

    access(path).then(() => flag = true).catch(() => flag = false)
    if(ext === '.js') res.setHeader('Content-Type', 'text/javascript')
    if(ext === '.svg') res.setHeader('Content-Type', 'image/svg+xml')

    try {
        const file = await readFile(path)
        return file
    }
    catch(e){
        return ''
    }
})

const app = new App({
    database: new LocalDatabase("./db.json"),
    controller: controller,
    cache: new Cache("./cache")
})