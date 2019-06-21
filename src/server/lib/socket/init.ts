import * as socketio from "socket.io";
import { Server }    from "http";
import { verify }    from "jsonwebtoken";

import Blacklist from "../../database/models/blacklist";
import Store     from "./store";

import { JWT_SECRET }     from "../../../../config/server";
import { SOCKET_ACTIONS } from "../../../constants";

import playNow from "./actions/playnow";

export default function init(server: Server) {
    const io = socketio(server);

    io.on("connection", (socket: SocketIO.Socket) => {
        let token = (socket.handshake.headers["authorization"] || "").slice(7);
        if (token) {
            Blacklist.countDocuments({ token })
                .then((count: number) => {
                    if (count) Store.registerSocket(socket, { type : "GUEST" });
                    verify(token, JWT_SECRET, function verifyToken(err, decoded: JWTUser) {
                        if (decoded) {
                            Store.registerSocket(socket, { type : "USER", id : decoded.id })
                        } else {
                            Store.registerSocket(socket, { type : "GUEST" })
                        }
                    });
                }).catch(console.log);
        } else {
            Store.registerSocket(socket, { type : "GUEST" });
        }


        socket.on("error", (err) => {
            console.log(err);
        });

        // socket.on(SOCKET_ACTIONS.PLAY_NOW, playNow);
        socket.on(SOCKET_ACTIONS.PLAY_NOW, (_, cb) => { cb({ id : "9wqpfFI3EVE", title : "What the hell is this", by : { name : "WinterCore", _id : "5d027c76603e434cb01a3df4" }, duration : 500, url : "http://localhost:8080/audio/0YF8vecQWYs.ogg" }); });


        socket.on("disconnect", () => {
            const data = Store.getSocketData(socket);
            if (data.id) {
                socket.to(data.id).emit(SOCKET_ACTIONS.ROOM_DESTROYED)
                Store.deleteSocket(socket);
            }
        });
    });
};