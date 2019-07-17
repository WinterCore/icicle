import * as socketio from "socket.io";

import { info }     from "../../youtube";
import { download } from "../../audio";

import User  from "../../../database/models/user";
import Song  from "../../../database/models/song";

import Store     from "../store";
import Scheduler from "../scheduler";

import { SOCKET_ACTIONS } from "../../../../constants";

import logger from "../../../logger";


export default async function playNow(socket: socketio.Socket, videoId: string) {
    try {
        const { type, id, currentRoomId, isProcessing } = Store.getSocketData(socket);
        if (isProcessing) {
            socket.emit(SOCKET_ACTIONS.ERROR, "Another action is being processed, please wait.");
        }
        Store.setSocketData(socket, { id, type, currentRoomId, isProcessing : true });
        let data: any = await Song.findOne({ videoId });
        if (!data)
            data = (await info([videoId])).items[0];
        const url = await download(videoId);
        socket.leaveAll();
        if (currentRoomId) // leave the old stream if found
            await User.updateOne({ _id : currentRoomId }, { $inc : { liveListeners : -1 } });
        if (type === "USER") {
            const user = await User.findOne({ _id : id });
            if (!user.nowPlaying) { // if the user is creating a room make him join it
                socket.join(user._id);
            }
            user.nowPlaying = {
                title     : data.title,
                duration  : data.duration,
                startedAt : new Date(),
                videoId,
                url
            };
            await user.save();
            Store.setSocketData(socket, {
                isProcessing  : false,
                currentRoomId : user._id,
                type,
                id
            });
            socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData()); // Notify the owner
            socket.in(id).emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData()); // Notify all the listeners
            Scheduler.emit("schedule-next", { user, socket, duration : data.duration });
        } else {
            socket.emit(SOCKET_ACTIONS.PLAY_NOW, { ...data, url, startAt : 0, by : { _id : null, name : "Unknown" } });
            Store.setSocketData(socket, { id, type, isProcessing : false, currentRoomId : null });
        }
    } catch(e) {
        socket.emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to play your video");
        logger.error(e);
    }
}