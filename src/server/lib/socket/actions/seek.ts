import * as socketio from "socket.io";

import User from "../../../database/models/user";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

export default async function seek(socket: socketio.Socket, currentTime: number) {
    try {
        const { type, id } = Store.getSocketData(socket);
        if (type === "USER") {
            const user: Database.User = await User.findOne({ _id : id });
            if (user.isStreaming()) {
                user.nowPlaying.startedAt = new Date(Date.now() - (currentTime * 1000));
                await user.save();
                socket.in(id).emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData());
                // TODO: Notify other sockets of the occurred seek
            }
        }
    } catch(e) {
        console.log(e);
    }
}