import { App } from "./src/app";
import LocalDatabase from "./src/database";
import { Controller } from "./src/controller";
import Cache from "./src/cache";

const app = new App({
    database: new LocalDatabase("./db.json"),
    controller: Controller,
    cache: new Cache("./cache")
})