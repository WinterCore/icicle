import { Schema, model } from "mongoose";

const Playlist = new Schema({
    name : String,
    songs : {
        type    : [String],
        default : [],
        index   : true
	},
	user : { type : Schema.Types.ObjectId, ref : "users", index : true }
});

export default model<Database.Playlist>("playlists", Playlist);