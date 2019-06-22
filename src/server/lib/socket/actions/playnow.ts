import * as socketio from "socket.io";

import { info }     from "../../youtube";
import { download } from "../../audio";

import User from "../../../database/models/user";

import Store from "../store";

import { DOMAIN }         from "../../../../../config/server";
import { SOCKET_ACTIONS } from "../../../../constants";

export default async function playNow(socket: socketio.Socket, videoId: string) {
    try {
        const { items : [data] } = await info([videoId]);
        const filename = await download(videoId);
        const url = `${DOMAIN}/audio/${filename}`;
        const { type, id } = Store.getSocketData(socket);
        if (type === "USER") {
            const user = await User.findOne({ _id : id });
            user.nowPlaying = {
                title     : data.title,
                duration  : data.duration,
                startedAt : new Date(),
                pausedAt  : null,
                url
            };
            await user.save();
            socket.emit(SOCKET_ACTIONS.PLAY_NOW, { ...data, url, startAt : 0, by : { _id : user._id, name : user.name } });
        } else {
            socket.emit(SOCKET_ACTIONS.PLAY_NOW, { ...data, url, startAt : 0, by : { _id : null, name : "Unknown" } });
        }
    } catch(e) {
        console.log(e);
    }
}