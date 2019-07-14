import { Request } from "express";
import { curry }   from "ramda";

const playlistResource = curry((req: Request, item) => ({
    _id  : item._id,
    name : item.name
}));

export default playlistResource;