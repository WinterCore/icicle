import { Schema, model } from "mongoose";

const Playlist = new Schema({
    name : String,
    user : {
        _id     : Schema.Types.ObjectId,
        name    : String,
        picture : String
    }
});

export default model<Database.Playlist>("playlists", Playlist);