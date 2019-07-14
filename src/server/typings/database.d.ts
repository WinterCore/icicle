import { Document } from "mongoose";

interface User extends Document {
    name          : string;
    googleId      : string;
    picture       : string;
    email         : string;
    following     : string[];
    liveListeners : number;
    nowPlaying    : NowPlaying;

    getNowPlayingCurrentTime() : number;
    getNowPlayingData       () : number;
    isStreaming             () : boolean;
}

interface Video {
    id        : string;
    title     : string;
    thumbnail : string;
    duration  : number;
}


interface NowPlaying {
    title     : string;
    url       : string;
    duration  : number;
    startedAt : Date;
    videoId   : string;
}

interface Queue extends Document {
    title     : string;
    videoId   : string;
    thumbnail : string;
    duration  : number;
    date      : Date;
    by        : string | User;
}


interface Song extends Queue {
    title     : string;
    videoId   : string;
    thumbnail : string;
    duration  : number;
    date      : Date;
    playlists : string[];
    by        : string | User;
}

interface BlacklistItem extends Document {
    user  : string | User;
    token : string;
}

interface BasicUser {
    _id     : string;
    name    : string;
    picture : string;
}

interface Playlist extends Document {
    name : string;
    user : BasicUser;
}

export as namespace Database;