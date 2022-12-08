import { Server, createServer, RequestListener } from "node:http"
import { IDatabase, IController, ICache } from "./types";

type AppOptions = {
    database: IDatabase,
    controller: IController,
    cache: ICache
}

export class App {
    database: IDatabase 
    controller: IController
    cache: ICache
    server: Server = new Server()

    constructor({ database, controller, cache }: AppOptions){
        this.database = database
        this.controller = controller
        this.cache = cache

        this.server = new Server(controller({
            database: this.database, 
            cache: this.cache
        }))
        this.server.listen(3000)
    }
}

