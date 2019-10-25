import { Server }               from "http";
import { verify, VerifyErrors } from "jsonwebtoken";

import Blacklist from "../../database/models/blacklist";
import Store     from "./store";

import IO from "./io";


import { JWT_SECRET }     from "../../../../config/server";
import { SOCKET_ACTIONS } from "../../../constants";

import playNow     from "./actions/playnow";
import play        from "./actions/play";
import seek        from "./actions/seek";
import check       from "./actions/check";
import join        from "./actions/join";
import skip        from "./actions/skip";
import leave       from "./actions/leave";
import destroy     from "./actions/destroy";
import inviteJoin  from "./actions/invite-join";
import sendMessage from "./actions/send-message";

import logger from "../../logger";
import User from "../../database/models/user";
import { updateListenersCount } from "./helpers";

function attachEvents(socket: IcicleSocket) {
    
    socket.on("error", (err) => logger.error(err));

    socket.on(SOCKET_ACTIONS.PLAY_NOW, data => playNow(socket, data).catch((err) => logger.error(err)));
    socket.on(SOCKET_ACTIONS.PLAY, () => play(socket).catch((err) => logger.error(err)));
    socket.on(SOCKET_ACTIONS.SEEK, data => seek(socket, data).catch((err) => logger.error(err)));
    socket.on(SOCKET_ACTIONS.CHECK, data => check(socket, data).catch((err) => logger.error(err)));
    socket.on(SOCKET_ACTIONS.JOIN, data => join(socket, data).catch((err) => logger.error(err)));
    socket.on(SOCKET_ACTIONS.INVITE_JOIN, (token) => inviteJoin(socket, token).catch((err) => logger.error(err)))
    socket.on(SOCKET_ACTIONS.SKIP, () => skip(socket).catch((err) => logger.error(err)));
    socket.on(SOCKET_ACTIONS.LEAVE, () => leave(socket).catch((err) => logger.error(err)));
    socket.on(SOCKET_ACTIONS.END_STREAM, () => destroy(socket).catch((err) => logger.error(err)));
    socket.on(SOCKET_ACTIONS.PROBE_LISTENERS, () => {
        const { currentRoomId } = socket.user;
        User.findById(currentRoomId)
            .then(user => socket.emit(SOCKET_ACTIONS.UPDATE_LISTENERS, (user as Database.User).liveListeners))
            .catch(() => null);
    });
    // socket.on(SOCKET_ACTIONS.NEW_MESSAGE, (roomId, message) => sendMessage(socket, roomId, message));

    socket.on("disconnect", () => {
        const { currentRoomId } = socket.user;
        socket.leaveAll();
        if (currentRoomId) {
            updateListenersCount(currentRoomId);
        }
    });
}

export default function init(server: Server) {
    const io = IO.init(server);

    io.on("connection", (socket: IcicleSocket) => {
        socket.user = { isProcessing : false };
        socket.on(SOCKET_ACTIONS.AUTHENTICATE, (token) => {
            if (token) {
                Blacklist.countDocuments({ token })
                    .then((count: number) => {
                        if (count) Store.setSocketData(socket, { isProcessing : false });
                        verify(token, JWT_SECRET, function verifyToken(err : VerifyErrors, decoded: string | object) {
                            if (decoded) {
                                socket.user = { id : (decoded as JWTUser).id, isProcessing : false };
                            } else {
                                socket.user = { isProcessing : false };
                            }
                        });
                    }).catch(console.log);            
            } else {
                socket.user = { isProcessing : false };
            }
            socket.emit(SOCKET_ACTIONS.AUTHENTICATED);
        });
        attachEvents(socket);
    });
};