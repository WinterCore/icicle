import { Schema, model } from "mongoose";

const Song = new Schema({
	title     : String,
	date      : { type : Date, default : Date.now },
	videoId   : { type : String, index : true, unique : true },
	duration  : { type : Number },
	thumbnail : String
});

export default model<Database.Song>("songs", Song);