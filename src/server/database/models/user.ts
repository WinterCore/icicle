import { Schema, model } from "mongoose";

import Queue from "./queue";

import { AUDIO_URL } from "../../../../config/server";

const UserSchema: Schema = new Schema({
    name          : String,
    googleId      : String,
    email         : { type : String, unique : true },
    picture       : String,
    following     : [Schema.Types.ObjectId],
    liveListeners : { type : Number, default : 0 },
    premium       : { type : Boolean, default : false },
    limits        : {
        lastPlaylistImport : { type : Date, default : new Date("2000-1-1") }
    },
    settings      : {
        invisMode : {
            type    : Boolean,
            default : false
        }
    },
    nowPlaying    : {
        id        : String,
        title     : String,
        url       : String,
        thumbnail : String,
        videoId   : String,
        duration  : Number,
        startedAt : Date
    }
});

UserSchema.methods.getNowPlayingCurrentTime = function getNowPlayingCurrentTime(this: Database.StreamingUser): number {
    return (Date.now() - this.nowPlaying.startedAt.getTime()) / 1000;
};

UserSchema.methods.isStreaming = function isStreaming(this: Database.User) { // I have no idea how to use a typeguard here
    return this.nowPlaying && !!this.nowPlaying.url;
};

UserSchema.methods.getRoomData = function getRoomData(this: Database.User) {
    return { _id : this._id, name : this.name };
};

UserSchema.methods.getNowPlayingData = function getPlayerData(this: Database.StreamingUser) {
    if (!this.isStreaming()) return null;
    return {
        id            : this.nowPlaying.id,
        title         : this.nowPlaying.title,
        duration      : this.nowPlaying.duration,
        thumbnail     : this.nowPlaying.thumbnail,
        startAt       : this.getNowPlayingCurrentTime(),
        url           : this.nowPlaying.url,
        videoId       : this.nowPlaying.videoId,
        by            : this.getRoomData(),
        liveListeners : this.liveListeners
    };
};

UserSchema.methods.extractNextItemInQueue =
    async function getNextItemInQueue(this: Database.User): Promise<Database.Queue | null> {
        const [queueItem] = await Queue.find({ by : this._id }).sort({ _id : 1 }).limit(1);
        if (!queueItem) return null;
        await queueItem.remove();
        return queueItem;
    };

UserSchema.methods.setNowPlayingData = async function setNowPlayingData(this: Database.User, song: Database.Song): Promise<void> {
    this.nowPlaying = {
        id        : `${this._id}${Date.now()}`,
        title     : song.title,
        duration  : song.duration,
        thumbnail : song.thumbnail,
        startedAt : new Date(),
        url       : AUDIO_URL(song.videoId),
        videoId   : song.videoId
    };
    await this.save();
};

export default model<Database.User>("user", UserSchema);