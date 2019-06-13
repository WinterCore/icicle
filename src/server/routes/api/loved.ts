import { Router, Request, Response } from "express";

import User from "../../database/models/user";

import { co } from "../helpers";

const router: Router = Router();

router.get("/", co(async (req: Request, res: Response) => {
    const { loved }: Database.User = await User.findOne({ _id : req.userId });

    res.json({ data : loved });
}));


export default router;