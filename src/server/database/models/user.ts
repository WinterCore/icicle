import { Schema, model } from "mongoose";

const UserSchema: Schema = new Schema({
    name          : String,
    googleId      : String,
    email         : { type : String, unique : true },
    picture       : String,
    following     : [Schema.Types.ObjectId],
    liveListeners : { type : Number, default : 0 },
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
        videoId   : String,
        duration  : Number,
        startedAt : Date
    }
});

UserSchema.methods.getNowPlayingCurrentTime = function getNowPlayingCurrentTime(this: Database.User): number {
    return (Date.now() - this.nowPlaying.startedAt.getTime()) / 1000;
};

UserSchema.methods.isStreaming = function isStreaming(this: Database.User): boolean {
    return this.nowPlaying && !!this.nowPlaying.url;
};

UserSchema.methods.getRoomData = function getRoomData(this: Database.User) {
    return { _id : this._id, name : this.name };
};

UserSchema.methods.getNowPlayingData = function getPlayerData(this: Database.User) {
    if (!this.isStreaming()) return null;
    return {
        id            : this.nowPlaying.id,
        title         : this.nowPlaying.title,
        duration      : this.nowPlaying.duration,
        startAt       : this.getNowPlayingCurrentTime(),
        url           : this.nowPlaying.url,
        videoId       : this.nowPlaying.videoId,
        by            : this.getRoomData(),
        liveListeners : this.liveListeners
    };
};

export default model<Database.User>("user", UserSchema);