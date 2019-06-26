import { Router, Request, Response } from "express";
import { google }                    from "googleapis";
import { pick }                      from "ramda";
import { sign }                      from "jsonwebtoken";

import User      from "../../database/models/user";
import Blacklist from "../../database/models/blacklist";

import authenticated from "../middleware/authenticated";

import { co }                        from "../helpers";
import { GOOGLE_CONFIG, JWT_SECRET } from "../../../../config/server";

const router: Router = Router();

const defaultScopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

const userProperties = [
    "_id",
    "name",
    "email",
    "picture",
    "limit",
    "isMod"
];

function createConnection() {
  return new google.auth.OAuth2(
    GOOGLE_CONFIG.clientId,
    GOOGLE_CONFIG.clientSecret,
    GOOGLE_CONFIG.redirect
  );
}

router.post("/google", co(async (req: Request, res: Response) => {
    const conn = createConnection();
    const url  = await conn.generateAuthUrl({
      access_type : "offline",
      prompt      : "consent",
      scope       : defaultScopes
    });
    res.json({ url });
}));

router.get("/google/callback", co(async (req: Request, res: Response) => {
    const conn = createConnection();
    const { tokens } = await conn.getToken(req.query.code);
    conn.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: conn, version: "v2" });
    const { data } = await oauth2.userinfo.get();
    
    let user: Database.User = await User.findOne({ googleId : data.id });
    if (user) {
        user.email   = data.email;
        user.name    = data.name;
        user.picture = data.picture;
        user.save();
    } else {
        user = new User({
            email    : data.email,
            name     : data.name,
            picture  : data.picture,
            googleId : data.id
        });
        user.save();
    }
    const token: string = await sign({ id : user._id, expiresIn : "7 days" }, JWT_SECRET);
    res.json({ data : { ...pick(userProperties, user.toObject()), token } });
}));

router.post("/logout", authenticated, co(async (req: Request, res: Response) => {
  Blacklist.insertMany([{ user : req.userId, token : req.header("Authorization").slice(7) }]);
  res.json({});
}));

export default router;