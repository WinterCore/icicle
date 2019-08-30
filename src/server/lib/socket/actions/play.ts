import * as socketio from "socket.io";

import User   from "../../../database/models/user";

import Store     from "../store";
import RoomStore from "../room-store";
import Scheduler from "../scheduler";

import { SOCKET_ACTIONS } from "../../../../constants";

import logger from "../../../logger";

export default async function play(socket: socketio.Socket) {
    try {
        const { id, currentRoomId } = Store.getSocketData(socket);
        if (!id) return;

        const user = await User.findById(id) as Database.User;
        if (user.isStreaming()) return;


        if (currentRoomId && currentRoomId !== id) { // If the socket is already in another stream, decrement the stream's liveListeners (since the socket is leaving it)
            await User.updateOne({ _id : currentRoomId }, { $inc : { liveListeners : -1 } });
            RoomStore.removeListener(currentRoomId, id);
            socket.leave(currentRoomId);
            socket.join(id);
            Store.setSocketData(socket, { id, currentRoomId : id, isProcessing : false });
        }

        Scheduler.emit("schedule-next", { user, socket, duration : 0 });
    } catch(e) {
        socket.emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to join the specified room");
        logger.error(e);
    }
}