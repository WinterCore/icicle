import * as express    from "express";
import * as morgan     from "morgan";
import * as bodyParser from "body-parser";
import * as path       from "path";

import { Request, Response, Application } from "express";

import Api from "./api";

import errorHandler from "../errors/handler";

export default async function initializeServer() {
    const app: Application = express();
    app.set("view engine", "ejs");
    app.set("trust proxy", 1);
    app.use(bodyParser.json());
    app.use(morgan("tiny"));
    app.set("views", path.resolve("./src/server/views"));
    app.use(express.static(path.resolve("./public")));
    app.use("/api", Api);

    app.get("/bundle.js", (_: Request, res: Response) => res.sendFile(path.resolve("./dist/store/bundle.js")));
    app.get("/bundle.js.map", (_: Request, res: Response) => res.sendFile(path.resolve("./dist/store/bundle.js.map")));

    app.get("*", (req: Request, res: Response) => {
        res.render("index", {
            title       : "test",
            headerTags  : ""
        });
    });
    
    app.use(errorHandler);

    app.listen(8081, () => {
        console.log("The server is running on port 8081");
    });
};