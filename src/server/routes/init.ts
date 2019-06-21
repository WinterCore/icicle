import * as express    from "express";
import * as morgan     from "morgan";
import * as path       from "path";
import * as http       from "http";

import { Request, Response, Application } from "express";

import Api from "./api";

import errorHandler from "../errors/handler";
import initSocket   from "../lib/socket/init";
import { download } from "../lib/audio";

export default async function initializeServer() {
    const app: Application = express();
    const server           = http.createServer(app);

    app.set("view engine", "ejs");
    app.set("trust proxy", 1);
    app.use(morgan("tiny"));
    app.set("views", path.resolve("./src/server/views"));
    app.use(express.static(path.resolve("./public")));
    app.use(express.static(path.resolve("./node_modules/flexboxgrid/dist")));
    app.use("/api", Api);

    // app.get("/bundle.js", (_, res: Response) => res.sendFile(path.resolve("./dist/store/bundle.js")));
    // app.get("/bundle.js.map", (_, res: Response) => res.sendFile(path.resolve("./dist/store/bundle.js.map")));

    initSocket(server);

    app.get("*", (_, res: Response) => {
        res.render("index", {
            title       : "test",
            headerTags  : ""
        });
    });
    
    app.use(errorHandler);

    server.listen(8081, () => {
        console.log("The server is running on port 8081");
    });
};