import * as socketio from "socket.io";

import User from "../../../database/models/user";

import Store     from "../store";
import RoomStore from "../room-store";

import { SOCKET_ACTIONS } from "../../../../constants";

import logger from "../../../logger";

export default async function check(socket: socketio.Socket, roomId: string) {
    try {
        const socketData = Store.getSocketData(socket);
        if (roomId) {
            const user: Database.User = await User.findOne({ _id : roomId });
            if (user && user.isStreaming()) {
                if (
                    socketData.id !== roomId // the user is not joining his own stream
                    && user.settings.invisMode // the user is using invis mode
                    && !RoomStore.doesRoomContainListener(roomId, socketData.id) // the user does not exist in the room listeners
                ) {
                    socket.emit(SOCKET_ACTIONS.ERROR, "You need an invite link to be able to join this room");
                    socket.emit(SOCKET_ACTIONS.END_STREAM);
                    return;
                }
                if (socketData.id !== roomId) { // if the socket is not the owner of the stream (roomId) increment the stream's liveListeners
                    await User.updateOne({ _id : roomId }, { $inc : { liveListeners : 1 }});
                    if (socketData.type === "USER") { // add the user to the listeners list only if he's logged in
                        RoomStore.addListener(roomId, socketData.id);
                    }
                    socket.in(roomId).emit(SOCKET_ACTIONS.SOCKET_JOINED);
                }
                socket.join(roomId);
                Store.setSocketData(socket, { ...socketData, currentRoomId : roomId });
                socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData());
            }
        } else {
            if (socketData.id) {
                const user: Database.User = await User.findOne({ _id : socketData.id });
                if (user && user.isStreaming()) {
                    socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData());
                    Store.setSocketData(socket, { ...socketData, currentRoomId : socketData.id });
                    socket.join(socketData.id);
                }
            }
        }
    } catch(e) {
        
        logger.error(e);
    }
}