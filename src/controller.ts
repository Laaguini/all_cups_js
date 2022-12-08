import { IController, IDatabase, ICache } from "./types";
import FoldersController from "./controllers/folders"

type ControllerOptions = {
    database: IDatabase
    cache: ICache
}

const Controller: IController = ({ database, cache }: ControllerOptions) => async (req, res) => {
    const url = <string>req.url

    await FoldersController({ url, database, res, cache })

    res.end()
}

export { Controller, ControllerOptions }