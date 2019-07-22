import { Schema, model } from "mongoose";

const Invite = new Schema({
    token  : {
        type   : String,
        unique : true
    },
    endsAt : Date,
    user   : Schema.Types.ObjectId
});

export default model<Database.Invite>("invites", Invite);