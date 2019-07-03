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

    app.set("trust proxy", 1);
    app.use(morgan("tiny"));
    app.set("views", path.resolve("./src/server/views"));
    app.use(express.static(path.resolve("./public")));
    app.use(express.static(path.resolve("./node_modules/flexboxgrid/dist")));
    app.use(express.static(path.resolve("./dist/frontend")));
    app.use("/api", Api);

    initSocket(server);

    app.get("*", (_, res: Response) => {
        res.sendFile(path.resolve("./dist/frontend/index.html"));
    });
    
    app.use(errorHandler);

    server.listen(8081, () => {
        console.log("The server is running on port 8081");
    });
};