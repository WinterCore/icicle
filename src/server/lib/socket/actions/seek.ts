import User from "../../../database/models/user";

import { SOCKET_ACTIONS } from "../../../../constants";
import Scheduler from "../scheduler";
import {IcicleSocket} from "../../../typings";

export default async function seek(socket: IcicleSocket, currentTime: number) {
    const { id } = socket.user;
    if (id) {
        const user = await User.findOne({ _id : id }) as Database.StreamingUser;
        if (user.isStreaming()) {
            const startedAt = new Date(Date.now() - (currentTime * 1000));
            user.nowPlaying.startedAt = startedAt;
            await user.save();
            socket.in(id).emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData()); // Notify the listeners of the seek
            Scheduler.emit("schedule-next", { user, socket, duration : user.nowPlaying.duration - user.getNowPlayingCurrentTime() });
        }
    }
}
