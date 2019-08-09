import * as socketio from "socket.io";

import User   from "../../database/models/user";
import Queue  from "../../database/models/queue";

import RoomStore from "./room-store";
import Scheduler from "./scheduler";

import { SOCKET_ACTIONS } from "../../../constants";

export const terminateStream = async (socket: socketio.Socket, id: string) => {
    await User.updateOne({ _id : id }, { $set : { nowPlaying : null, liveListeners : 0 } });
    await Queue.deleteMany({ by : id }); // Clear his queue
    Scheduler.cancel(id);
    socket.in(id).emit(SOCKET_ACTIONS.END_STREAM, true); // Notify all the listeners to the socket that the stream has ended
    RoomStore.purgeRoom(id);
    const io = socketio();
    io.of("/").in(id).clients(function(error, clients) {
        if (clients.length > 0) {
            clients.forEach(function (socket_id) {
                io.sockets.sockets[socket_id].leave(id);
            });
        }
    });
};