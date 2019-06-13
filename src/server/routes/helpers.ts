import { RequestHandler, Request, Response  } from "express";

export const co = (f: Function): RequestHandler =>
    (req: Request, res: Response, next: Function): Promise<void> => f(req, res, next).catch(next);