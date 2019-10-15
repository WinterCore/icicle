import { Router, Request, Response } from "express";
import Invite from "../../database/models/invite";

import authenticated from "../middleware/authenticated";

import { co } from "../helpers";
import { DOMAIN } from "../../../../config/frontend";

const router = Router();

router.post("/", authenticated, co(async (req: Request, res: Response) => {
    let invite = new Invite({ user : req.userId });
    invite.endsAt = new Date(Date.now() + (1000 * 60 * 60));
    let token = Buffer.from(`${Date.now()}${Math.random()}`).toString('base64');
    while (await Invite.countDocuments({ token }) > 0) {
        token = Buffer.from(`${Date.now()}${Math.random()}`).toString('base64');
    }
    invite.token = token;
    await invite.save();

    res.json({ data : `${DOMAIN}/invite/${token}` });
}));

export default router;