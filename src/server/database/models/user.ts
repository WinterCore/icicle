import { Schema, model } from "mongoose";

const UserSchema: Schema = new Schema({
    name          : String,
    googleId      : String,
    email         : { type : String, unique : true },
    picture       : String,
    following     : [Schema.Types.ObjectId],
    liveListeners : { type : Number, default : 0 },
    nowPlaying    : {
        title     : String,
        url       : String,
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

UserSchema.methods.getNowPlayingData = function getPlayerData(this: Database.User) {
    return {
        title         : this.nowPlaying.title,
        duration      : this.nowPlaying.duration,
        startAt       : this.getNowPlayingCurrentTime(),
        url           : this.nowPlaying.url,
        by            : { _id : this._id, name : this.name },
        liveListeners : this.liveListeners
    };
};

export default model<Database.User>("user", UserSchema);