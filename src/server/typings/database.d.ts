import { Document } from "mongoose";

interface User extends Document {
    name     : String,
    googleId : String,
    picture  : String,
    email    : String,
    limit    : Number,
    isMod    : Boolean,
    loved    : LovedItem
}

interface Request extends Document {
    title     : String,
    videoId   : String,
    thumbnail : String,
    duration  : Number,
    date      : Date,
    didPlay   : Boolean,
    by        : {
        name : String,
        id   : String | User
    }
}

interface BlacklistItem extends Document {
    user  : String | User,
    token : String
}

type LovedItem = {
    title     : String,
    videoId   : String,
    thumbnail : String,
    duration  : Number
}

export as namespace Database;