import { Request, Response } from "express";
import Playlist from "../../../database/models/playlist";


import ValidationError from "../../../errors/validation";

export default function validatePlaylist(req: Request, res: Response, next: (err?: Error) => void) {
    const { name } = req.body;
    if (!name) return next(new ValidationError(["The name parameter is required"]));
    Playlist.countDocuments({ "user._id" : req.userId, name })
        .then((count) => {
            if (count > 0) return next(new ValidationError(["Another playlist with the same name already exists."]));
            else next();
        }).catch(next);
}