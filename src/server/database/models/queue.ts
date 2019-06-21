import { Schema, model } from "mongoose";

const Request = new Schema({
	title     : String,
	date      : { type : Date, default : Date.now },
	videoId   : { type : String },
	duration  : { type : Number },
	thumbnail : String,
	by        : { type : Schema.Types.ObjectId, ref : "users" }
});

export default model<Database.Request>("request", Request);