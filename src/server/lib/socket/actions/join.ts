import * as socketio from "socket.io";

import User   from "../../../database/models/user";

import Store     from "../store";
import RoomStore from "../room-store";

import { SOCKET_ACTIONS } from "../../../../constants";

import logger from "../../../logger";

import { terminateStream } from "../helpers";

export default async function join(socket: socketio.Socket, streamerId: string, invite: boolean = false) {
    try {
        const { type, id, currentRoomId } = Store.getSocketData(socket);
        if (currentRoomId === streamerId || id === streamerId) {
            // check if the socket is trying to join the same stream it"s currently in or if a user is trying to join his own stream
            return;
        }
        const streamer: Database.User = await User.findOne({ _id : streamerId });
        if (streamer.settings.invisMode && !invite) {
            return socket.emit(SOCKET_ACTIONS.ERROR, "You're trying to join a private room, You need an invite link to be able to join.");
        }
        if (currentRoomId) { // If the socket is already in another stream, decrement the stream's liveListeners (since the socket is leaving it)
            await User.updateOne({ _id : currentRoomId }, { $inc : { liveListeners : -1 } });
            if (type === "USER") { // remove him from the listeners list
                RoomStore.removeListener(currentRoomId, id);
            }
        }
        if (type === "USER") {
            // Terminate the socket's current stream
            await terminateStream(socket, id);
        }

        streamer.liveListeners += 1;
        await streamer.save();
        socket.join(streamerId);
        Store.setSocketData(socket, { id, type, currentRoomId : streamerId });
        if (type === "USER") {
            RoomStore.addListener(streamerId, id);
        }

        // Notify the socket
        socket.in(streamerId).emit(SOCKET_ACTIONS.SOCKET_JOINED);
        socket.emit(SOCKET_ACTIONS.PLAY_NOW, streamer.getNowPlayingData());
    } catch(e) {
        socket.emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to join the specified room");
        logger.error(e);
    }
}