import * as socketio from "socket.io";

import { info }     from "../../youtube";
import { download } from "../../audio";

import User from "../../../database/models/user";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

export default async function join(socket: socketio.Socket, streamerId: string) {
    try {
        const { type, id } = Store.getSocketData(socket);
        if (
            type === "USER"
            && id !== streamerId // check if the user is trying to join his own stream
        ) {
            // If the joining user is streaming something then stop his stream
            const user: Database.User = await User.findOne({ _id : id });
            user.nowPlaying = null;
            user.liveListeners = 0;
            await user.save();
            // TODO : Notify all the users that the stream has ended
        }
        const streamer: Database.User = await User.findOne({ _id : streamerId });
        streamer.liveListeners += 1;
        await streamer.save();
        if (id !== streamerId) socket.join(streamerId);
        socket.emit(SOCKET_ACTIONS.PLAY_NOW, streamer.getNowPlayingData());
    } catch(e) {
        console.log(e);
    }
}