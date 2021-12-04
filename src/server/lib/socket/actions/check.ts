import User from "../../../database/models/user";

import RoomStore from "../room-store";

import { SOCKET_ACTIONS } from "../../../../constants";
import { updateListenersCount } from "../helpers";
import {IcicleSocket} from "../../../typings";

export default async function check(socket: IcicleSocket, roomId: string) {
    const { id } = socket.user;
    if (roomId) {
        const user = await User.findById(roomId);
        if (user) {
            if (user.settings.invisMode) {
                if (
                    !id // the user is not logged in
                    || (
                        id !== roomId
                        && !RoomStore.doesRoomContainListener(roomId, id) // if the user is logged in, and doesn't have an invite
                    )
                ) { 
                    socket.emit(SOCKET_ACTIONS.ERROR, "You need an invite link to be able to join this room");
                    socket.emit(SOCKET_ACTIONS.END_STREAM);
                    return;
                }
            }
            socket.join(roomId);
            socket.user.currentRoomId = roomId;
            updateListenersCount(roomId);
            if (user.isStreaming()) {
                socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData());
            }
        }
    } else {
        if (id) {
            const user = await User.findById(id) as Database.User;
            if (user && user.isStreaming()) {
                socket.join(id);
                socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData());
                socket.user.currentRoomId = id;
            }
        }
    }
}
