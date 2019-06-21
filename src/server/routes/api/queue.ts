import { Router, Request, Response } from "express";

import User from "../../database/models/user";

import NotFoundError from "../../errors/notfound";
import { info }      from "../../lib/youtube";
import { co }        from "../helpers";
import validateQueue from "../middleware/validation/queue";
import authenticated from "../middleware/authenticated";

const router = Router();

router.post("/", [authenticated, validateQueue], co(async (req: Request, res: Response) => {
    const { id } = req.body;

    const { items : [data] } = await info([id]);

    await User.updateOne({ _id : req.userId }, { $push : { queue : { $each : [data], $position : 0 } } });

    res.json({ message : "Added successfully!" });
}));

export default router;