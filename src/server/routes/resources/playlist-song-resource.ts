import { Request } from "express";
import { curry }   from "ramda";

const playlistSongResource = curry((req: Request, item) => ({
    _id       : item._id,
    title     : item.title,
    duration  : item.duration,
    thumbnail : item.thumbnail,
    videoId   : item.videoId
}));

export default playlistSongResource;