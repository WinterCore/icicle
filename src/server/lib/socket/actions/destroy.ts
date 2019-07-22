import * as socketio from "socket.io";

import logger from "../../../logger";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

import { terminateStream } from "../helpers";

export default async function destroy(socket: socketio.Socket) {
    try {
        const { type, id } = Store.getSocketData(socket);
        if (type === "USER") {
            await terminateStream(socket, id);
            socket.emit(SOCKET_ACTIONS.END_STREAM);
        }
        
    } catch(e) {
        socket.emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to end your stream");
        logger.error(e);
    }
}