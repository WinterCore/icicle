import * as socketio from "socket.io";

import User from "../../../database/models/user";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

import logger from "../../../logger";

export default async function sendMessage(socket: socketio.Socket, roomId: string, message: string) {
    try {
        const { id } = Store.getSocketData(socket);
        if (id) {
            const user = (await User.findOne({ _id : id }) as Database.User);
            const messageData: Message = {
                message,
                date : Date.now(),
                by : {
                    _id     : user._id,
                    name    : user.name,
                    picture : user.picture
                }
            };
            socket.in(roomId).emit(SOCKET_ACTIONS.NEW_MESSAGE, messageData);
        }
    } catch(e) {
        logger.error(e);
    }
}