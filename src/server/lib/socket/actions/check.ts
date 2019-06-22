import * as socketio from "socket.io";

import User from "../../../database/models/user";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

export default async function check(socket: socketio.Socket, roomId: string) {
    try {
        const socketData = Store.getSocketData(socket);
        const id = socketData ? socketData.id : roomId;
        const user: Database.User = await User.findOne({ _id : id });
        if (user && user.nowPlaying) {
            console.log(user.getNowPlayingCurrentTime());
            socket.emit(SOCKET_ACTIONS.PLAY_NOW, {
                title    : user.nowPlaying.title,
                url      : user.nowPlaying.url,
                duration : user.nowPlaying.duration,
                startAt  : user.getNowPlayingCurrentTime(),
                isPaused : !!user.nowPlaying.pausedAt,
                by : {
                    _id  : user._id,
                    name : user.name
                }
            });

            /*
                TODO: Check if the user is the owner of the stream
                    - If the user is not the owner he will be joined to the room and sent the nowplaying data
            */
        }
    } catch(e) {
        console.log(e);
    }
}