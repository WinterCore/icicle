import { Request } from "express";
import { curry }   from "ramda";
import {Queue} from "../../typings/database";

const queueResource = curry((req: Request, item: Queue) => ({
    _id       : item._id,
    title     : item.title,
    videoId   : item.videoId,
    duration  : item.duration,
    thumbnail : item.thumbnail
}));

export default queueResource;
