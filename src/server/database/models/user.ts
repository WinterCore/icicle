import { Schema, model } from "mongoose";

const UserSchema: Schema = new Schema({
    name          : String,
    googleId      : String,
    email         : { type : String, unique : true },
    picture       : String,
    following     : [Schema.Types.ObjectId],
    liveListeners : Number,
    nowPlaying    : {
        title     : String,
        url       : String,
        duration  : Number,
        startedAt : Date,
        pausedAt  : Date
    }
});

UserSchema.methods.getNowPlayingCurrentTime = function getNowPlayingCurrentTime(this: Database.User): number {
    if (this.nowPlaying.pausedAt) {
        return (this.nowPlaying.startedAt.getTime() - (Date.now() - this.nowPlaying.pausedAt.getTime())) / 1000;
    }
    return (Date.now() - this.nowPlaying.startedAt.getTime()) / 1000;
};

export default model<Database.User>("user", UserSchema);