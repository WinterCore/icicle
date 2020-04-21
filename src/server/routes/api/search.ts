import { Router, Request, Response } from "express";

import { search } from "../../lib/youtube";

import { co } from "../helpers";

const router = Router();

router.get("/", co(async (req: Request, res: Response) => {
    const query: SearchParams = {
        nextPageToken : req.query.nextPageToken?.toString(),
        q             : req.query.q?.toString()
    };
    const data = await search(query);
    res.json(data);
}));

export default router;