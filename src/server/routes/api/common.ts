import { Router, Request, Response } from "express";

import { co } from "../helpers";

import Setting from "../../database/models/setting";

const router = Router();

router.get("/changelog", co(async (req: Request, res: Response) => {
    const { changelog } = await Setting.findOne();

    res.json({ data : changelog.reverse() });
}));

export default router;