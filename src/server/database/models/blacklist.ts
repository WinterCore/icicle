import { Schema, model } from "mongoose";

const Request = new Schema({
    user  : { type : Schema.Types.ObjectId, ref : "users" },
    token : String
});

export default model<Database.BlacklistItem>("request", Request);