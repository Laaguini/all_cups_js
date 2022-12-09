import { App } from "./app";
import LocalDatabase from "./database";
import { Controller, ControllerCtx } from "./controller";
import Cache from "./cache";
import { md5 } from "../utils";

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
        doc: '', 
        to: e.to.map(t => ({ ...t, avatar: '' })) 
    }))

    return res.json(emails)
})

controller.on('/api/folders/:folder/:email', async (ctx, req, res) => {
    const folderAliases = await createFolderAliases(ctx)

    const emails = (await ctx.database.find(e => folderAliases[e.folder ?? 'Входящие'] === req.params.folder)).values

    return res.json(emails[Number(req.params.email)])
})

const app = new App({
    database: new LocalDatabase("../db.json"),
    controller: controller,
    cache: new Cache("./cache")
})