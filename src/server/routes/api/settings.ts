import { Router, Request, Response } from "express";

import { co } from "../helpers";

import User from "../../database/models/user";

import authenticated from "../middleware/authenticated";

const router = Router();

router.get("/", authenticated, co(async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    res.json({
        data :{
            invisMode : user.settings.invisMode
        }
    });
}));

router.post("/", authenticated, co(async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    const { invisMode } = req.body;
    user.settings.invisMode = !!invisMode;
    await user.save();

    res.sendStatus(200);
}));

export default router;