import { Router, Request, Response } from "express";

import { info } from "../../lib/youtube";

import Queue from "../../database/models/queue";

import authenticated from "../middleware/authenticated";
import validateQueue from "../middleware/validation/queue";

import { co } from "../helpers";


const router = Router();

const projection = {
    name          : 1,
    picture       : 1,
    nowPlaying    : 1,
    liveListeners : 1
};

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

export default router;