import { Request, Response } from "express";

import Unauthenticated from "./unauthenticated";

export default function errorHandler(err: any, req: Request, res: Response, next: Function): void {
    if (err instanceof Unauthenticated) {
        res.sendStatus(401);
    } else {
        res.sendStatus(500);
    }
}