import * as express    from "express";
import * as morgan     from "morgan";
import * as path       from "path";
import * as http       from "http";
import * as helmet     from "helmet";

import { Request, Response, Application } from "express";

import Api from "./api";

import errorHandler from "../errors/handler";
import initSocket   from "../lib/socket/init";
import { PORT } from "../../../config/server";

export default async function initializeServer() {
    const app: Application = express();
    const server           = http.createServer(app);

    app.use(helmet());
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

    server.listen(PORT, () => {
        console.log("The server is running on port " + PORT);
    });
};