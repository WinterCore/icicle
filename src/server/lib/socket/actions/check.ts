import * as socketio from "socket.io";

import User from "../../../database/models/user";

import Store     from "../store";
import RoomStore from "../room-store";

import { SOCKET_ACTIONS } from "../../../../constants";

import logger from "../../../logger";

export default async function check(socket: socketio.Socket, roomId: string) {
    try {
        const { id } = Store.getSocketData(socket);
        if (roomId) {
            const user = await User.findById(roomId);
            if (user && user.isStreaming()) {
                if (id === roomId) return; // the user is not joining his own stream
                if (user.settings.invisMode) {
                    if (
                        !id // the user is not logged in
                        || !RoomStore.doesRoomContainListener(roomId, id) // if the user is logged in, and doesn't have an invite
                    ) { 
                        socket.emit(SOCKET_ACTIONS.ERROR, "You need an invite link to be able to join this room");
                        socket.emit(SOCKET_ACTIONS.END_STREAM);
                        return;
                    }
                }
                if (id !== roomId) { // if the socket is not the owner of the stream (roomId) increment the stream's liveListeners
                    await User.updateOne({ _id : roomId }, { $inc : { liveListeners : 1 }});
                    if (id) { // add the user to the listeners list only if he's logged in
                        RoomStore.addListener(roomId, id);
                    }
                    socket.in(roomId).emit(SOCKET_ACTIONS.SOCKET_JOINED);
                }
                socket.join(roomId);
                Store.setSocketData(socket, { id, currentRoomId : roomId, isProcessing : false });
                socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData());
            }
        } else {
            if (id) {
                const user = await User.findById(id) as Database.User;
                if (user && user.isStreaming()) {
                    socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData());
                    Store.setSocketData(socket, { id, currentRoomId : id, isProcessing : false });
                    socket.join(id);
                }
            }
        }
    } catch(e) {
        
        logger.error(e);
    }
}