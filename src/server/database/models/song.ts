import { Schema, model } from "mongoose";

const Song = new Schema({
	title     : String,
	date      : { type : Date, default : Date.now },
	videoId   : { type : String },
	duration  : { type : Number },
	thumbnail : String,
    playlists : [Schema.Types.ObjectId],
	by        : { type : Schema.Types.ObjectId, ref : "users", index : true }
});

export default model<Database.Song>("songs", Song);