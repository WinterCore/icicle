import { Router, Request, Response } from "express";

import { search } from "../../lib/youtube";

import { co } from "../helpers";

const router = Router();

router.get("/", co(async (req: Request, res: Response) => {
    if (!req.query.q) {
        res.sendStatus(400);
    } else {
        const query: SearchParams = {
            nextPageToken : req.query.nextPageToken?.toString(),
            q             : req.query.q.toString()
        };
        const data = await search(query);
        res.json(data);
    }
}));

export default router;