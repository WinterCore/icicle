import User   from "../../../database/models/user";
import RoomStore from "../room-store";

import { SOCKET_ACTIONS } from "../../../../constants";

import { terminateStream, updateListenersCount } from "../helpers";

export default async function join(socket: IcicleSocket, streamerId: string, invite: boolean = false) {
    const { id, currentRoomId } = socket.user;
    if (id === streamerId) { // if a user is trying to join his own stream
        return;
    }
    const streamer = await User.findOne({ _id : streamerId }) as Database.User;
    if (streamer.settings.invisMode && !invite) {
        socket.emit(SOCKET_ACTIONS.ERROR, "You're trying to join a private room, You need an invite link to be able to join.");
        return;
    }
    if (currentRoomId) { // If the socket is already in another stream
        if (id) { // remove him from the listeners list
            RoomStore.removeListener(currentRoomId, id);
        }
        socket.leave(currentRoomId);
        updateListenersCount(currentRoomId);
    }
    if (id) {
        // Terminate the socket's current stream
        await terminateStream(socket, id);
    }
    
    updateListenersCount(streamerId);
    socket.join(streamerId);
    socket.user.currentRoomId = streamerId;
    if (id) {
        RoomStore.addListener(streamerId, id);
    }
    if (streamer.isStreaming()) {
        socket.emit(SOCKET_ACTIONS.PLAY_NOW, streamer.getNowPlayingData());
    } else {
        socket.emit(SOCKET_ACTIONS.DEAD_JOIN, streamer.getRoomData());
    }
}