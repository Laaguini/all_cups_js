import { IController, IDatabase, ICache, RouteHandler } from "./types";
import { RequestListener, IncomingMessage, ServerResponse } from "http";

type ControllerCtx = {
    database: IDatabase
    cache: ICache
}

type Route = {
    regex: RegExp,
    params: string[],
    handler: RouteHandler<ControllerCtx>
}

class Controller implements IController<ControllerCtx> {
    routes: Route[] = []

    on(path: string, handler: RouteHandler<ControllerCtx>){
        const regex = new RegExp(path.replace(/(:[^\/]*)/g, "([^\/]*)"))
        const params = path.split("/").filter(e => e[0] === ":").map(e => e.slice(1))

        this.routes.push({
            regex: regex, 
            params: params ?? [], 
            handler: handler
        })
    }

    unwrap(ctx: ControllerCtx){
        const listener: RequestListener = (req, res) => {}
        return listener
    }

    private extendReq(req: IncomingMessage) {
        const url = new URL(<string>req.url, req.headers.host)
        const { pathname, search: query } = url

        return Object.assign(req, { query, pathname })
    }

    private extendRes(res: ServerResponse) {
        return Object.assign(res, {
            json: (data: Object) => res.write(JSON.stringify(data))
        })
    }
}

export { Controller, ControllerCtx }