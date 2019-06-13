import { Schema, model } from "mongoose";

const UserSchema: Schema = new Schema({
    name     : String,
    googleId : String,
    email    : { type : String, unique : true },
    picture  : String,
    limit    : { type : Number, default : 2 },
    isMod    : { type : Boolean, default : false },
    loved    : {
        type : [{
            title     : String,
            videoId   : String,
            thumbnail : String,
            duration  : Number
        }],
        default : []
    }
});


export default model<Database.User>("user", UserSchema);