import { Document } from "mongoose";

interface User extends Document {
    name          : string
    googleId      : string
    picture       : string
    email         : string
    following     : string[]
    liveListeners : number
    nowPlaying    : NowPlaying

    getNowPlayingCurrentTime(): number
}

interface NowPlaying {
    title     : string
    url       : string
    duration  : number
    startedAt : Date
    pausedAt  : Date | null
}

interface Video {
    id        : string
    title     : string
    thumbnail : string
    duration  : number
}

interface Request extends Document {
    title     : string
    videoId   : string
    thumbnail : string
    duration  : number
    date      : Date
    didPlay   : boolean
    by        : {
        name : string
        id   : string | User
    }
}

interface BlacklistItem extends Document {
    user  : string | User
    token : string
}

export as namespace Database;