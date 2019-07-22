import * as socketio from "socket.io";

import Store     from "../store";
import RoomStore from "../room-store";

import logger from "../../../logger";


export default async function leave(socket: socketio.Socket) {
    try {
        const { type, id, currentRoomId } = Store.getSocketData(socket);
        if (currentRoomId) {
            RoomStore.removeListener(currentRoomId, id);
            socket.leave(currentRoomId)
        }
        Store.setSocketData(socket, { type, id, isProcessing : false, currentRoomId : null });
    } catch(e) {
        logger.error(e);
    }
}