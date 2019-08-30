import * as socketio from "socket.io";

import User   from "../../database/models/user";
import Queue  from "../../database/models/queue";

import RoomStore from "./room-store";
import Scheduler from "./scheduler";

import { SOCKET_ACTIONS } from "../../../constants";

export const terminateStream = async (io: SocketIO.Server, socket: socketio.Socket, id: string) => {
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