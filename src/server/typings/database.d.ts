import { Document } from "mongoose";

interface User extends Document {
    name          : string;
    googleId      : string;
    picture       : string;
    email         : string;
    following     : string[];
    premium       : boolean;
    limits        : { lastPlaylistImport : Date };
    liveListeners : number;
    nowPlaying    : NowPlaying | null;
    settings      : { invisMode : boolean; };

    getNowPlayingCurrentTime ()           : number;
    getNowPlayingData        ()           : number;
    isStreaming              ()           : boolean;
    getRoomData              ()           : PlayerDataUser;
    getNowPlayingData        ()           : PlayerData;
    setNowPlayingData        (song: Song) : Promise<void>;
    extractNextItemInQueue   ()           : Promise<Song | null>;
}

interface StreamingUser extends User {
    nowPlaying : NowPlaying;
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

interface Queue extends Song {
    by : string | User;
}

interface Setting extends Document {
    changelog : {
        version : string;
        changes : string[];
    }[]
}

interface Song extends Document{
    title     : string;
    videoId   : string;
    thumbnail : string;
    duration  : number;
    date     ?: Date;
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
    name  : string;
    user  : User | string;
    songs : string[]
}

interface Invite extends Document {
    token  : string;
    endsAt : Date;
    user   : string;
}

export as namespace Database;
