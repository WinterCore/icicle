import { Schema, model } from "mongoose";

const Queue = new Schema({
	title     : String,
	date      : { type : Date, default : Date.now },
	videoId   : { type : String },
	duration  : { type : Number },
	thumbnail : String,
    order     : Number,
	by        : { type : Schema.Types.ObjectId, ref : "users", index : true }
});

export default model<Database.Queue>("queue", Queue);
