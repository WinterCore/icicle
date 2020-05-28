import { Router, Request, Response } from "express";

import { info } from "../../lib/youtube";

import Queue from "../../database/models/queue";

import authenticated from "../middleware/authenticated";
import validateQueue from "../middleware/validation/queue";

import queueResource from "../resources/queue-resource";

import { co } from "../helpers";

const router = Router();

router.get("/:room", co(async (req: Request, res: Response) => {
    const { room } = req.params;
    const queueItems: Database.Queue[] = await Queue.find({ by : room }).sort({ date : 1, order : -1 }).limit(8);
    return res.json({ data : queueItems.map(queueResource(req)) });
}));

router.post("/", [authenticated, validateQueue], co(async (req: Request, res: Response) => {
    const { id } = req.body;

    const { items : [data] } = await info([id]);

    const queueItem = new Queue({
        title     : data.title,
        videoId   : id,
        thumbnail : data.thumbnail,
        duration  : data.duration,
        by        : req.userId
    });

    queueItem.save();

    return res.json({ message : "Added successfully" });
}));


router.delete("/:id", [authenticated], co(async (req: Request, res: Response) => {
    const { id } = req.params;

    await Queue.deleteOne({ by : req.userId, _id : id });

    const queueItems: Database.Queue[] = await Queue.find({ by : req.userId }).sort({ date : 1, order : -1 }).limit(8);
    return res.json({ data : queueItems.map(queueResource(req)) });
}));

router.post("/clear", [authenticated], co(async (req: Request, res: Response) => {

    await Queue.deleteMany({ by : req.userId });

    return res.json({ message : "Your queue has been cleared successfully" });
}));
export default router;
