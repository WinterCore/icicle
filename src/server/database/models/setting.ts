import { Schema, model } from "mongoose";

const Setting = new Schema({
	changelog : [{
		version : String,
		changes : [String]
	}]
});

export default model<Database.Setting>("settings", Setting);