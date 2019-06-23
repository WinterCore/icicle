import * as socketio from "socket.io";

import User from "../../../database/models/user";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

export default async function check(socket: socketio.Socket, roomId: string) {
    try {
        if (roomId) {
            const user: Database.User = await User.findOne({ _id : roomId });
            if (user && user.isStreaming()) {
                socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData());
                socket.join(roomId);
            }
        } else {
            const socketData = Store.getSocketData(socket);

            if (socketData.id) {
                const user: Database.User = await User.findOne({ _id : socketData.id });
                if (user && user.isStreaming()) {
                    socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData());

                    /*
                        TODO: Check if the user is the owner of the stream
                            - If the user is not the owner he will be joined to the room and sent the nowplaying data
                    */
                }
            }
        }
    } catch(e) {
        console.log(e);
    }
}