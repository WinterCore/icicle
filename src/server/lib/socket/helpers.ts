import * as socketio from "socket.io";

import User   from "../../database/models/user";
import Queue  from "../../database/models/queue";

import RoomStore from "./room-store";
import Scheduler from "./scheduler";

import { SOCKET_ACTIONS } from "../../../constants";

import IO from "./io";
import logger from "../../logger";

export const terminateStream = async (socket: socketio.Socket, id: string) => {
    const io = IO.getInstance();
    await User.updateOne({ _id : id }, { $set : { nowPlaying : null, liveListeners : 0 } });
    await Queue.deleteMany({ by : id }); // Clear his queue
    Scheduler.cancel(id);
    socket.in(id).emit(SOCKET_ACTIONS.END_STREAM); // Notify all the listeners to the socket that the stream has ended
    socket.in(id).emit(SOCKET_ACTIONS.ERROR, "The stream has been terminated by the streamer.");
    RoomStore.purgeRoom(id);
    io.of("/").in(id).clients(function(error: Error, clients: string[]) {
        if (clients.length > 0) {
            clients.forEach(function (socket_id) {
                io.sockets.sockets[socket_id].leave(id);
            });
        }
    });
};


export const updateListenersCount = async (streamerId: string): Promise<void> => {
    const io = IO.getInstance();
    io.in(streamerId).clients((err: Error, clients: string[]) => {
        if (!err) {
            const liveListeners = clients.length;
            User.updateOne({ _id : streamerId }, { $set : { liveListeners } }).catch((err) => logger.error(err));
        }
    });

};