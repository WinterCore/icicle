import { Schema, model } from "mongoose";

const Request = new Schema({
	title     : String,
	date      : { type : Date, default : Date.now },
	videoId   : { type : String },
	duration  : { type : Number },
	didPlay   : { type : Boolean, default : false },
	thumbnail : String,
	by        : {
		name : String,
        id   : { type : Schema.Types.ObjectId, ref : "users" }
	}
});

export default model<Database.Request>("request", Request);