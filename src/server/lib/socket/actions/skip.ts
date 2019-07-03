import * as socketio from "socket.io";

import User  from "../../../database/models/user";

import Store     from "../store";
import Scheduler from "../scheduler";

import logger from "../../../logger";


export default async function skip(socket: socketio.Socket, videoId: string) {
    try {
        const { type, id } = Store.getSocketData(socket);
        if (type === "USER") {
            const user = await User.findOne({ _id : id });
            if (user.isStreaming()) {
                Scheduler.emit("schedule-next", { user, socket, duration : 0 }); // Duration of 0 to make the schedular skip to the next song immediately
            }
        }
    } catch(e) { logger.error(e); }
}