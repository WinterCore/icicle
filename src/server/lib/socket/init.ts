import * as socketio from "socket.io";
import { Server }    from "http";
import { verify }    from "jsonwebtoken";

import Blacklist from "../../database/models/blacklist";
import Store     from "./store";

import User from "../../database/models/user";

import { JWT_SECRET }     from "../../../../config/server";
import { SOCKET_ACTIONS } from "../../../constants";

import playNow     from "./actions/playnow";
import seek        from "./actions/seek";
import check       from "./actions/check";
import join        from "./actions/join";
import skip        from "./actions/skip";
import sendMessage from "./actions/send-message";

import logger from "../../logger";

export default function init(server: Server) {
    const io = socketio(server);

    io.on("connection", (socket: SocketIO.Socket) => {
        let token = (socket.handshake.headers["authorization"] || "").slice(7);
        if (token) {
            Blacklist.countDocuments({ token })
                .then((count: number) => {
                    if (count) Store.setSocketData(socket, { type : "GUEST" });
                    verify(token, JWT_SECRET, function verifyToken(err, decoded: JWTUser) {
                        if (decoded) {
                            Store.setSocketData(socket, { type : "USER", id : decoded.id })
                        } else {
                            Store.setSocketData(socket, { type : "GUEST" })
                        }
                    });
                }).catch(console.log);
            
        } else {
            Store.setSocketData(socket, { type : "GUEST" });
        }


        socket.on("error", (err) => logger.error(err));

        socket.on(SOCKET_ACTIONS.PLAY_NOW, data => playNow(socket, data));
        socket.on(SOCKET_ACTIONS.SEEK, data => seek(socket, data));
        socket.on(SOCKET_ACTIONS.CHECK, data => check(socket, data));
        socket.on(SOCKET_ACTIONS.JOIN, data => join(socket, data));
        socket.on(SOCKET_ACTIONS.SKIP, data => skip(socket, data));
        socket.on(SOCKET_ACTIONS.NEW_MESSAGE, (roomId, message) => sendMessage(socket, roomId, message));


        socket.on("disconnect", () => {
            const { id, currentRoomId } = Store.getSocketData(socket);
            if (id) {
                Store.deleteSocket(socket);
            }
            if (currentRoomId) {
                socket.in(currentRoomId).emit(SOCKET_ACTIONS.SOCKET_LEFT);
                if (currentRoomId !== id) { // if the user is in a room other than his decrement its live listeners
                    User.updateOne({ _id : currentRoomId }, { $inc : { liveListeners : -1 } }).catch(logger.error);
                }
            }
        });
    });
};