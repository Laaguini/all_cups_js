import { App } from "./src/app";
import LocalDatabase from "./src/database";
import { Controller } from "./src/controller";
import Cache from "./src/cache";

const controller = new Controller()

controller.on('/folders/:folder/:email', async (ctx, req, res) => {
    return `Folder: ${req.params.folder} Email: ${req.params.email} Offset: ${Number(req.query.offset)} EmailsCount: ${(await ctx.database.take(Infinity)).values.length}`
})

const app = new App({
    database: new LocalDatabase("./db.json"),
    controller: controller,
    cache: new Cache("./cache")
})