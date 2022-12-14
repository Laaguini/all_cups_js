import { IController, IDatabase, ICache, RouteHandler, ExtendedRes, ExtendedReq, ReqWithParams } from "../types";
import { RequestListener, IncomingMessage, ServerResponse } from "http";
import { parse as parseURL } from "node:url"
import { zip } from "../utils.js";
import stream from "node:stream"
import { createReadStream } from "node:fs"

type ControllerCtx = {
    database: IDatabase
    cache: ICache
}

type Route = {
    pattern: RegExp,
    params: string[],
    handler: RouteHandler<ControllerCtx>
}

class Controller implements IController<ControllerCtx> {
    routes: Route[] = []

    on(path: string, handler: RouteHandler<ControllerCtx>){
        const pattern = new RegExp(path.replace(/(:[^\/]*)/g, "([^\/?]*)") + '(\\?.*)?$')
        
        const params = path.split("/").filter(e => e[0] === ":").map(e => e.slice(1))

        this.routes.push({
            pattern: pattern, 
            params: params ?? [], 
            handler: handler
        })
    }

    unwrap(ctx: ControllerCtx){
        const listener: RequestListener = async (req, res) => {
            res.setHeader("Access-Control-Allow-Origin", "*")

            const extendedReq = this.extendReq(req)
            const extendedRes = this.extendRes(res)

            for(const route of this.routes) {
                const handlerRes = this.handle(ctx, extendedReq, extendedRes, route)

                if(!handlerRes) continue

                try {
                    res.write(await handlerRes)
                }
                catch(e) {
                    res.write(String(await handlerRes))
                }
                break; // Захардкожено для возможности обрабатывать одновременно и роуты с параметрами и роуты с жестким URL
            }

            res.end()
        }

        return listener
    }

    private handle(ctx: ControllerCtx, req: ReturnType<typeof this.extendReq>, res: ReturnType<typeof this.extendRes>, route: Route) {
        const matches = route.pattern.exec(req.url ?? '')

        if(!route.pattern.test(req.url as string)) return

        const params = zip(route.params, matches?.slice(1) || [])
        const extendedReq: ExtendedReq & ReqWithParams = Object.assign(req, { params }) 

        return route.handler(ctx, extendedReq, res)
    }

    private extendReq(req: IncomingMessage): ExtendedReq {
        const { pathname, query } = parseURL(<string>req.url, true)

        return Object.assign(req, { query, pathname })
    }

    private extendRes(res: ServerResponse): ExtendedRes {
        return Object.assign(res, {
            json: (data: Object) => JSON.stringify(data),
            file: (path: string) => createReadStream(path)
        })
    }
}

export { Controller, ControllerCtx }