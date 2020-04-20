import * as socketio from "socket.io";

import logger from "../../../logger";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

import { terminateStream } from "../helpers";

export default async function destroy(socket: IcicleSocket) {
    const { id } = socket.user;
    if (id) {
        await terminateStream(socket, id);
        socket.emit(SOCKET_ACTIONS.END_STREAM);
    }
}