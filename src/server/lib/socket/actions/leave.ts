import * as socketio from "socket.io";

import Store     from "../store";
import RoomStore from "../room-store";

import logger from "../../../logger";


export default async function leave(socket: socketio.Socket) {
    try {
        const { id, currentRoomId } = Store.getSocketData(socket);
        if (id && currentRoomId) {
            RoomStore.removeListener(currentRoomId, id);
            socket.leave(currentRoomId)
        }
        Store.setSocketData(socket, { id, isProcessing : false });
    } catch(e) {
        logger.error(e);
    }
}