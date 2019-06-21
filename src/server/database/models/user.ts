import { Schema, model } from "mongoose";

const UserSchema: Schema = new Schema({
    name      : String,
    googleId  : String,
    email     : { type : String, unique : true },
    picture   : String,
    following : [Schema.Types.ObjectId],
    queue     : [{
        id        : String,
        thumbnail : String,
        title     : String,
        duration  : Number
    }]
});


export default model<Database.User>("user", UserSchema);