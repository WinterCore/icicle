import User  from "../../../database/models/user";

import RoomStore from "../room-store";
import Scheduler from "../scheduler";

import { SOCKET_ACTIONS } from "../../../../constants";

import { AUDIO_URL } from "../../../../../config/server";
import { getSong } from "../../../services/song";

import IO from "../io";
import { updateListenersCount } from "../helpers";


export default async function playNow(socket: IcicleSocket, videoId: string): Promise<void> {
    const { id, currentRoomId, isProcessing } = socket.user;
    const io = IO.getInstance();
    if (isProcessing) {
        socket.emit(SOCKET_ACTIONS.ERROR, "Another action is being processed, please wait.");
        return;
    }
    socket.user.isProcessing = true;

    let data = null;
    try {
        data = await getSong(videoId);
    } catch(e) {
        socket.emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to play your video");
        return;
    }
    if (id) {
        if (currentRoomId && currentRoomId !== id) {
            RoomStore.removeListener(currentRoomId, id);
            socket.leave(currentRoomId);
            updateListenersCount(currentRoomId);
        }
        const user = await User.findOne({ _id : id }) as Database.User;
        if (!user.isStreaming()) { // if the user is creating a room make him join it
            socket.join(id);
        }
        await user.setNowPlayingData(data);
        socket.user.isProcessing = false;
        socket.user.currentRoomId = id;
        const nowPlayingData = user.getNowPlayingData();

        io.in(id).emit(SOCKET_ACTIONS.PLAY_NOW, nowPlayingData); // Notify all the listeners
        Scheduler.emit("schedule-next", { user, socket, duration : data.duration });
    } else {
        socket.emit(SOCKET_ACTIONS.PLAY_NOW, { ...data.toObject(), url : AUDIO_URL(videoId), startAt : 0, by : { _id : null, name : "Unknown" } });
        socket.user.isProcessing = false;
    }
}