import * as socketio from "socket.io";

import { info }     from "../../youtube";
import { download } from "../../audio";

import User from "../../../database/models/user";

import Store from "../store";

import { SOCKET_ACTIONS } from "../../../../constants";

export default async function playNow(socket: socketio.Socket, videoId: string) {
    try {
        const { items : [data] } = await info([videoId]);
        const url = await download(videoId);
        const { type, id } = Store.getSocketData(socket);
        socket.leaveAll();
        if (type === "USER") {
            const user = await User.findOne({ _id : id });
            user.nowPlaying = {
                title     : data.title,
                duration  : data.duration,
                startedAt : new Date(),
                url
            };
            await user.save();
            socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData());
        } else {
            socket.emit(SOCKET_ACTIONS.PLAY_NOW, { ...data, url, startAt : 0, by : { _id : null, name : "Unknown" } });
        }
    } catch(e) {
        console.log(e);
    }
}