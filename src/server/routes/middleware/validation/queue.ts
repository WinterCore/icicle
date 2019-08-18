import { Request, Response } from "express";
import Queue from "../../../database/models/queue";


import ValidationError from "../../../errors/validation";

export default function validateQueue(req: Request, res: Response, next) {
    const { id } = req.body;
    if (!id) return next(new ValidationError(["The id parameter is required"]));
    next();
    // Queue.countDocuments({ by : req.userId, videoId : id })
    //     .then((count) => {
    //         if (count > 0) return next(new ValidationError("The video is already in the queue"));
    //         else next();
    //     }).catch(next);
}