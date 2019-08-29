import { EventEmitter } from "events";

import logger from "../../logger";

import { download } from "../audio";

import { SOCKET_ACTIONS } from "../../../constants";

import Store from "./store";


class Scheduler extends EventEmitter {
    // Using maps so I can run into memory leaks and learn how to deal with them
    jobs: any = {};

    constructor() {
        super();

        this.on("schedule-next", ({ user, socket, duration } : { user : Database.User, socket : SocketIO.Socket, duration : number }) => {
            this.cancel(user._id);
            this.schedule(user._id, setTimeout(async () => {
                try {
                    const data = Store.getSocketData(socket);
                    Store.setSocketData(socket, { ...data, isProcessing : true });
                    const queueItem = await user.extractNextItemInQueue();
                    if (queueItem) {
                        await download(queueItem.videoId);
                        await user.setNowPlayingData(queueItem);
                        socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData()); // Notify the owner
                        socket.in(user._id).emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData()); // Notify all the listeners
                        this.emit("schedule-next", { user, socket, duration : queueItem.duration });
                    } else {
                        user.nowPlaying = null;
                        await user.save();
                        socket.emit(SOCKET_ACTIONS.PLAY_NOW, null); // Notify the owner
                        socket.in(user._id).emit(SOCKET_ACTIONS.PLAY_NOW, null); // Notify all the listeners
                    }
                    
                    Store.setSocketData(socket, { ...data, isProcessing : false });
                } catch (e) { logger.error(e); }
            }, duration * 1000));
        });
    }

    private schedule(id: string, timeoutId: NodeJS.Timeout) { this.jobs[id] = timeoutId; }
    public cancel(id: string) {
        const timeoutId = this.jobs[id];
        clearTimeout(timeoutId);
        delete this.jobs[id];
    }
}

export default new Scheduler();