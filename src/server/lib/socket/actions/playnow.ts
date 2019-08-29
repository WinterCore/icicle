import * as socketio from "socket.io";

import { info }     from "../../youtube";
import { download } from "../../audio";

import User  from "../../../database/models/user";
import Song  from "../../../database/models/song";

import Store     from "../store";
import RoomStore from "../room-store";
import Scheduler from "../scheduler";

import { SOCKET_ACTIONS } from "../../../../constants";

import logger from "../../../logger";
import { AUDIO_URL } from "../../../../../config/server";


export default async function playNow(socket: socketio.Socket, videoId: string) {
    try {
        const { type, id, currentRoomId, isProcessing } = Store.getSocketData(socket);
        if (isProcessing) {
            return socket.emit(SOCKET_ACTIONS.ERROR, "Another action is being processed, please wait.");
        }
        Store.setSocketData(socket, { id, type, currentRoomId, isProcessing : true });
        let data: Database.Song = await Song.findOne({ videoId });
        await download(videoId);
        if (!data) {
            const youtubeData = (await info([videoId])).items[0];
            const data = new Song({
                title     : youtubeData.title,
                videoId   : videoId,
                thumbnail : youtubeData.thumbnail,
                duration  : youtubeData.duration
            });
            data.save();
        }
        socket.leaveAll();
        if (type === "USER") {
            if (currentRoomId && currentRoomId !== id) { // if the user is another room (remove him from the listeners list)
                await User.updateOne({ _id : currentRoomId }, { $inc : { liveListeners : -1 } });
                RoomStore.removeListener(currentRoomId, id);
            }
            const user = await User.findOne({ _id : id });
            if (!user.nowPlaying) { // if the user is creating a room make him join it
                socket.join(user._id);
            }
            await user.setNowPlayingData(data);
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
            socket.emit(SOCKET_ACTIONS.PLAY_NOW, { ...data.toObject(), url : AUDIO_URL(videoId), startAt : 0, by : { _id : null, name : "Unknown" } });
            Store.setSocketData(socket, { id, type, isProcessing : false, currentRoomId : null });
        }
    } catch(e) {
        socket.emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to play your video");
        logger.error(e);
    }
}