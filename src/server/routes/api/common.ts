import { Router, Request, Response } from "express";

import { co } from "../helpers";

import Setting from "../../database/models/setting";

const router = Router();

router.get("/changelog", co(async (req: Request, res: Response) => {
    const { changelog } = (await Setting.findOne() as Database.Setting); // A setting record will always exist in the database

    res.json({ data : changelog.reverse() });
}));

export default router;