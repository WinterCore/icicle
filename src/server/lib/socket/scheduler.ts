import { EventEmitter } from "events";

import Queue from "../../database/models/queue";
import logger from "../../logger";

import { download } from "../audio";

import { SOCKET_ACTIONS } from "../../../constants";

class Scheduler extends EventEmitter {
    // Using maps so I can run into memory leaks and learn how to deal with them
    jobs: any = {};

    constructor() {
        super();

        this.on("schedule-next", ({ user, socket, duration }) => {
            this.cancel(user._id);
            this.schedule(user._id, setTimeout(async () => {
                try {
                    const queue: Database.Queue[] = await Queue.find({ by : user._id }).sort({ date : 1 }).limit(1);
                    const queueItem = queue[0];
                    if (queueItem) {
                        const url = await download(queueItem.videoId);
                        user.nowPlaying = {
                            title     : queueItem.title,
                            duration  : queueItem.duration,
                            startedAt : new Date(),
                            videoId   : queueItem.videoId,
                            url
                        };
                        await user.save();
                        await queueItem.remove();
                        socket.emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData()); // Notify the owner
                        socket.in(user._id).emit(SOCKET_ACTIONS.PLAY_NOW, user.getNowPlayingData()); // Notify all the listeners
                        this.emit("schedule-next", { user, socket, duration : queueItem.duration });
                    } else {
                        user.nowPlaying = null;
                        await user.save();
                        socket.emit(SOCKET_ACTIONS.PLAY_NOW, null); // Notify the owner
                        socket.in(user._id).emit(SOCKET_ACTIONS.PLAY_NOW, null); // Notify all the listeners
                    }
                } catch (e) { logger.error(e); }
            }, duration * 1000));
        });
    }

    private schedule(id: string, timeoutId: NodeJS.Timeout) { this.jobs[id] = timeoutId; }
    private cancel(id: string) {
        const timeoutId = this.jobs[id];
        clearTimeout(timeoutId);
        delete this.jobs[id];
    }
}

export default new Scheduler();