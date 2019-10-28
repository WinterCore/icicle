import { EventEmitter } from "events";
import { download } from "../audio";

import { SOCKET_ACTIONS } from "../../../constants";

import IO from "./io";

class Scheduler extends EventEmitter {
    // Using maps so I can run into memory leaks and learn how to deal with them
    jobs: any = {};

    constructor() {
        super();

        this.on("schedule-next", ({ user, duration } : { user : Database.User, duration : number }) => {
            const userId = user._id.toString();
            this.cancel(userId);
            this.schedule(userId, setTimeout(async () => {
                const queueItem = await user.extractNextItemInQueue();
                const io = IO.getInstance();
                if (queueItem) {
                    try {
                        await download(queueItem.videoId)
                    } catch (e) {
                        io.in(userId).emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to play the next video, skipping...");
                        this.emit("schedule-next", { user, duration : 0 });
                        return;
                    }
                    await user.setNowPlayingData(queueItem);
                    const nowPlayingData = user.getNowPlayingData();
                    io.in(userId).emit(SOCKET_ACTIONS.PLAY_NOW, nowPlayingData); 
                    this.emit("schedule-next", { user, duration : queueItem.duration });
                } else {
                    user.nowPlaying = null;
                    await user.save();
                    io.in(userId).emit(SOCKET_ACTIONS.PLAY_NOW, null);
                }
            }, duration * 1000));
        });
    }

    private schedule(id: string, timeoutId: NodeJS.Timeout) {
        this.jobs[id] = timeoutId;    
    }

    public cancel(id: string) {
        const timeoutId = this.jobs[id];
        clearTimeout(timeoutId);
        delete this.jobs[id];
    }
}

export default new Scheduler();