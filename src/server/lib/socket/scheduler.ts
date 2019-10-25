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
            this.cancel(user._id);
            this.schedule(user._id, setTimeout(async () => {
                const queueItem = await user.extractNextItemInQueue();
                const io = IO.getInstance();
                if (queueItem) {
                    download(queueItem.videoId).catch(() => {
                        io.in(user._id).emit(SOCKET_ACTIONS.ERROR, "Something happened while trying to play the next video, skipping...");
                        this.emit("schedule-next", { user, duration : 0 });
                    });
                    await user.setNowPlayingData(queueItem);
                    const nowPlayingData = user.getNowPlayingData();
                    io.in(user._id).emit(SOCKET_ACTIONS.PLAY_NOW, nowPlayingData); 
                    this.emit("schedule-next", { user, duration : queueItem.duration });
                } else {
                    user.nowPlaying = null;
                    await user.save();
                    io.in(user._id).emit(SOCKET_ACTIONS.PLAY_NOW, null);
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