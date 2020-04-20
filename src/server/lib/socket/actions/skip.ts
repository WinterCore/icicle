import * as socketio from "socket.io";

import User  from "../../../database/models/user";

import Store     from "../store";
import Scheduler from "../scheduler";

import logger from "../../../logger";

import { SOCKET_ACTIONS } from "../../../../constants";


export default async function skip(socket: IcicleSocket) {
    const { id, isProcessing, currentRoomId } = socket.user;
    if (id) {
        if (isProcessing) {
            socket.emit(SOCKET_ACTIONS.ERROR, "Another action is being processed, please wait.");
            return;
        }
        const user = await User.findOne({ _id : id }) as Database.User;
        if (user.isStreaming()) {
            Scheduler.emit("schedule-next", { user, socket, duration : 0 }); // Duration of 0 to make the schedular skip to the next song immediately
        }
    }
}