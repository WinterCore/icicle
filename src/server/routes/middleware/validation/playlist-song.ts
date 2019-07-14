import { Request, Response } from "express";
import Playlist from "../../../database/models/playlist";


import ValidationError from "../../../errors/validation";
import Unauthorized    from "../../../errors/unauthorized";

export default function validatePlaylist(req: Request, res: Response, next) {
    const { playlistId } = req.params;
    const { videoId }    = req.body;
    if (!videoId) return next(new ValidationError(["The videoId parameter is required"]));
    Playlist.countDocuments({ "user._id" : req.userId, _id : playlistId })
        .then((count) => {
            if (count === 0) return next(new Unauthorized());
            else next();
        }).catch(next);
}