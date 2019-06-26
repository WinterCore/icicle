import { Router, Request, Response } from "express";

import { search } from "../../lib/youtube";

import { co } from "../helpers";

const router = Router();

router.get("/", co(async (req: Request, res: Response) => {
    const data = await search(req.query);
    res.json(data);
}));

export default router;