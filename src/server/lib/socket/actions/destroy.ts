import * as socketio from "socket.io";

import logger from "../../../logger";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

import { terminateStream } from "../helpers";

export default async function destroy(io: SocketIO.Server, socket: socketio.Socket) {
    try {
        const { id } = Store.getSocketData(socket);
        if (id) {
            await terminateStream(io, socket, id);
            socket.emit(SOCKET_ACTIONS.END_STREAM);
        }
        
    } catch(e) {
        socket.emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to end your stream");
        logger.error(e);
    }
}