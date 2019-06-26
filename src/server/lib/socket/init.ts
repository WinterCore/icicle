import * as socketio from "socket.io";
import { Server }    from "http";
import { verify }    from "jsonwebtoken";

import Blacklist from "../../database/models/blacklist";
import Store     from "./store";

import User from "../../database/models/user";

import { JWT_SECRET }     from "../../../../config/server";
import { SOCKET_ACTIONS } from "../../../constants";

import playNow from "./actions/playnow";
import seek    from "./actions/seek";
import check   from "./actions/check";
import join    from "./actions/join";

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
        // let i = 0;
        // const testData = [
        //     { id : "9wqpfFI3EVE", title : "What the hell is this", by : { name : "WinterCore", _id : "5d027c76603e434cb01a3df4" }, duration : 500, url : "http://localhost:8080/audio/0YF8vecQWYs.ogg" },
        //     { id : "paxPBr_jb-U", title : "Hello World", by : { name : "WinterCore", _id : "5d027c76603e434cb01a3df4" }, duration : 500, url : "http://localhost:8080/audio/paxPBr_jb-U.ogg" }
        // ];
        // socket.on(SOCKET_ACTIONS.PLAY_NOW, (_, cb) => {
        //     socket.emit(SOCKET_ACTIONS.PLAY_NOW, testData[(i++ % testData.length)]);
        // });


        socket.on("disconnect", () => {
            const { id, currentRoomId } = Store.getSocketData(socket);
            if (id) {
                // socket.to(id).emit(SOCKET_ACTIONS.STREAM_ENDED);
                Store.deleteSocket(socket);
            }
            if (currentRoomId) {
                User.updateOne({ _id : currentRoomId }, { $inc : { liveListeners : -1 } }).catch(logger.error);
            }
        });
    });
};