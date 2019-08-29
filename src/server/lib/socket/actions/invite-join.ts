import * as socketio from "socket.io";

import Invite from "../../../database/models/invite";

import logger from "../../../logger";

import join from "./join";

import { SOCKET_ACTIONS } from "../../../../constants";

export default async function inviteJoin(io: SocketIO.Server, socket: socketio.Socket, token: string) {
    try {
        const invite = await Invite.findOne({ token });
        if (invite) {
            if (invite.endsAt.getTime() > Date.now()) {
                join(io, socket, invite.user.toString(), true);
            } else {
                socket.emit(SOCKET_ACTIONS.ERROR, "The invite link you're trying to use is expired");
            }
        } else {
            socket.emit(SOCKET_ACTIONS.ERROR, "The invite link you're trying to use is invalid");
        }
    } catch(e) {
        socket.emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to join the specified room");
        logger.error(e);
    }
}