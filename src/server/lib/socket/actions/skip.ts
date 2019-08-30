import * as socketio from "socket.io";

import User  from "../../../database/models/user";

import Store     from "../store";
import Scheduler from "../scheduler";

import logger from "../../../logger";

import { SOCKET_ACTIONS } from "../../../../constants";


export default async function skip(socket: socketio.Socket) {
    try {
        const { id, isProcessing, currentRoomId } = Store.getSocketData(socket);
        if (id) {
            if (isProcessing) {
                socket.emit(SOCKET_ACTIONS.ERROR, "Another action is being processed, please wait.");
                return;
            }
            Store.setSocketData(socket, { id, isProcessing : true, currentRoomId });
            const user = await User.findOne({ _id : id }) as Database.User;
            if (user.isStreaming()) {
                Scheduler.emit("schedule-next", { user, socket, duration : 0 }); // Duration of 0 to make the schedular skip to the next song immediately
            }
        }
    } catch(e) {
        socket.emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to play your video");
        logger.error(e);
    }
}