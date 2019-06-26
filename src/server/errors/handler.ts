import { Request, Response } from "express";

import Unauthenticated from "./unauthenticated";
import NotFound        from "./notfound";
import Validation      from "./validation";

import logger from "../logger";

export default function errorHandler(err: any, req: Request, res: Response, next: Function): void {
    if (err instanceof Unauthenticated) {
        res.sendStatus(401);
    } else if (err instanceof Validation) {
        res.status(422);
        res.json({ errors : err.errors });
    } else if (err instanceof NotFound) {
        res.status(404);
        res.json({ errors : ["We couldn't find what you were looking for!"] });
    } else {
        logger.error(err.stack);
        res.sendStatus(500);
    }
}