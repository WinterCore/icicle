import { Request, Response } from "express";


import ValidationError from "../../../errors/validation";

export default function validateQueue(req: Request, res: Response, next) {
    const { id } = req.body;
    if (!id) return next(new ValidationError(["The id parameter is required"]));
    next();
}