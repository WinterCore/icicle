import { Router, Request, Response } from "express";

import User from "../../database/models/user";

import { co }        from "../helpers";
import streamerResource from "../resources/streamer-resource";

const router = Router();

const projection = {
    name          : 1,
    picture       : 1,
    nowPlaying    : 1,
    liveListeners : 1
};

router.get("/", co(async (req: Request, res: Response) => {
    const { page = 1, q } = req.body;
    
    const streamers = await User
        .find({ nowPlaying : { $ne : null }, "settings.invisMode" : { $ne : true } }, projection)
        .sort({ liveListeners : -1 })
        .skip((page - 1) * 12)
        .limit(12);
    return res.json({ data : streamers.map(streamerResource(req)) });
}));

export default router;