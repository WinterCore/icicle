import * as socketio from "socket.io";

import User from "../../../database/models/user";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

import logger from "../../../logger";
import Scheduler from "../scheduler";

export default async function seek(socket: socketio.Socket, currentTime: number) {
    try {
        const { type, id } = Store.getSocketData(socket);
        if (type === "USER") {
            const user: Database.User = await User.findOne({ _id : id });
            if (user.isStreaming()) {
                const startedAt = new Date(Date.now() - (currentTime * 1000));
                user.nowPlaying.startedAt = startedAt;
                await user.save();
                socket.in(id).emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData()); // Notify the listeners of the seek
                Scheduler.emit("schedule-next", { user, socket, duration : user.nowPlaying.duration - user.getNowPlayingCurrentTime() });
            }
        }
    } catch(e) {
        logger.error(e);
    }
}