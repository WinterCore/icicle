import * as socketio from "socket.io";

import User  from "../../../database/models/user";
import Queue from "../../../database/models/user";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

import logger from "../../../logger";

export default async function join(socket: socketio.Socket, streamerId: string) {
    try {
        const { type, id, currentRoomId } = Store.getSocketData(socket);
        if (currentRoomId === streamerId) // check if the socket is trying to join the same stream it's currently in
            return;
        if (currentRoomId) // If the socket is already in another stream, decrement the stream's liveListeners (since the socket is leaving it)
            await User.updateOne({ _id : currentRoomId }, { $inc : { liveListeners : -1 } });
        if (
            type === "USER"
            && id !== streamerId // check if the socket is not joining its own stream
        ) {
            // Terminate the socket's current stream
            await User.updateOne({ _id : id }, { $set : { nowPlaying : null, liveListeners : 0 } });
            await Queue.deleteMany({ by : id }); // Clear his queue 
            socket.in(id).emit(SOCKET_ACTIONS.STREAM_ENDED); // Notify all the listeners to the socket that the stream has ended
        }

        const streamer: Database.User = await User.findOne({ _id : streamerId });
        streamer.liveListeners += 1;
        await streamer.save();
        if (id !== streamerId) // Prevent the streamer from joining his own stream
            socket.join(streamerId);
        Store.setSocketData(socket, { id, type, currentRoomId : streamerId });

        // Notify the socket
        socket.in(streamerId).emit(SOCKET_ACTIONS.SOCKET_JOINED);
        socket.emit(SOCKET_ACTIONS.PLAY_NOW, streamer.getNowPlayingData());
    } catch(e) {
        logger.error(e);
    }
}