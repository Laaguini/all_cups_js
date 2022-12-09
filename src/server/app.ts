import { Server } from "node:http"
import { ControllerCtx } from "./controller";
import { IDatabase, IController, ICache } from "../types";

type AppOptions = {
    database: IDatabase,
    controller: IController<ControllerCtx>,
    cache: ICache
}

export class App {
    database: IDatabase 
    controller: IController<ControllerCtx>
    cache: ICache
    server: Server

    constructor({ database, controller, cache }: AppOptions){
        this.database = database
        this.controller = controller
        this.cache = cache

        this.server = new Server(controller.unwrap({
            database: this.database, 
            cache: this.cache
        }))
        this.server.listen(3000)
    }
}

