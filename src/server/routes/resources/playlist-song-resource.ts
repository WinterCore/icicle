import { Request } from "express";
import { curry }   from "ramda";
import {Song} from "../../typings/database";

const playlistSongResource = curry((req: Request, item: Song) => ({
    _id       : item._id,
    title     : item.title,
    duration  : item.duration,
    thumbnail : item.thumbnail,
    videoId   : item.videoId
}));

export default playlistSongResource;
