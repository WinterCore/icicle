import { Request } from "express";
import { curry }   from "ramda";
import {Playlist} from "../../typings/database";

const playlistResource = curry((_: Request, item: Playlist) => ({
    _id  : item._id,
    name : item.name
}));

export default playlistResource;
