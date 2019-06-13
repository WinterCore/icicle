import { Request, Response } from "express";
import { verify }            from "jsonwebtoken";

import Blacklist from "../../database/models/blacklist";

import Unauthenticated from "../../errors/unauthenticated";

import { JWT_SECRET } from "../../../../config/server";

export default function authenticated(req: Request, res: Response, next: Function) {
    let token = (req.header("Authorization") || "").slice(7);
    if (!token) return next(new Unauthenticated());

    Blacklist.countDocuments({ token })
        .then((count: Number) => {
            if (count) return next(new Unauthenticated());
            verify(token, JWT_SECRET, function verifyToken(err, decoded: JWTUser) {
                if (err) return next(new Unauthenticated());
                if (decoded) {
                    req.userId = decoded.id;
                    next();
                } else {
                    next(new Unauthenticated());
                }
            });
        }).catch((err) => next(err));

}