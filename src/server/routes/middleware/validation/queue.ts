import { Request, Response } from "express";


import ValidationError from "../../../errors/validation";

export default function validateQueue(req: Request, res: Response, next: (err?: Error) => void) {
    const { id } = req.body;
    if (!id) return next(new ValidationError(["The id parameter is required"]));
    next();
}