import { Request } from "express";
import { curry }   from "ramda";

const queueResource = curry((req: Request, item) => ({
    _id       : item._id,
    title     : item.title,
    videoId   : item.videoId,
    duration  : item.duration,
    thumbnail : item.thumbnail
}));

export default queueResource;