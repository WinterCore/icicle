import { Document } from "mongoose";

interface User extends Document {
    name          : string;
    googleId      : string;
    picture       : string;
    email         : string;
    following     : string[];
    liveListeners : number;
    nowPlaying    : NowPlaying;
    settings      : { invisMode : boolean; };

    getNowPlayingCurrentTime ()           : number;
    getNowPlayingData        ()           : number;
    isStreaming              ()           : boolean;
    getRoomData              ()           : PlayerDataUser;
    getNowPlayingData        ()           : PlayerData;
    setNowPlayingData        (song: Song) : void;
    extractNextItemInQueue   ()           : Promise<Song | null>;
}

interface Video {
    id        : string;
    title     : string;
    thumbnail : string;
    duration  : number;
}


interface NowPlaying {
    id        : string;
    title     : string;
    url       : string;
    duration  : number;
    startedAt : Date;
    thumbnail : string;
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

interface Setting extends Document {
    changelog : {
        version : string;
        changes : string[];
    }[]
}

interface Song extends Queue {}

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
    name  : string;
    user  : BasicUser;
    songs : string[]
}

interface Invite extends Document {
    token  : string;
    endsAt : Date;
    user   : string;
}

export as namespace Database;