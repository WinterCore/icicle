import { Request, Response } from "express";
import { isURL }             from "validator";


import ValidationError from "../../../errors/validation";

export default function validateQueue(req: Request, res: Response, next: Function) {
    const { id } = req.body
    if (!id) next(new ValidationError(["The id parameter is required"]));
    else next();
}