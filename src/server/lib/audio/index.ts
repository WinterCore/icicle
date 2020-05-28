import * as ytdl from "youtube-dl";
import * as path from "path";
import * as fs   from "fs";
import { promisify } from "util";
import { EventEmitter } from "events";

import { AUDIO_PATH } from "../../../../config/server";

import logger from "../../logger";

const stat = promisify(fs.stat);

export const download = (id: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const output = path.resolve(AUDIO_PATH, `${id}.ogg`);

        ytdl.exec(`https://www.youtube.com/watch?v=${id}`, [
            "--force-ipv4",
            "--extract-audio",
            "--audio-format",
            "vorbis",
            "-o",
            output
        ], {}, (err, stdout) => {
            if (err) {
                reject();
                logger.error(err);
            }
            logger.info(`Youtube dl : ${id} ${stdout} ${err}`);
            resolve();
        });
    });
};

interface Job {
    id      : string;
    state   : Symbol;
    listeners : {
        resolve : (arg?: any) => void;
        reject  : (err: any) => void;
    }[];
}

class VideoDownloader extends EventEmitter {
    static CONCURRENCY = 2;

    static STATES = {
        READY      : Symbol('ready'),
        PROCESSING : Symbol('processing')
    }

    private jobs: Job[] = [];

    public getJobById(videoId: string) {
        return this.jobs.find(({ id }) => id === videoId);
    }

    public process(videoId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const output = path.resolve(AUDIO_PATH, `${videoId}.ogg`);
            stat(output)
                .then(() => resolve())
                .catch((err) => {
                    const existingJob = this.getJobById(videoId);
                    if (existingJob) {
                        existingJob.listeners.push({ resolve, reject });
                    } else {
                        this.jobs.push({
                            id        : videoId,
                            state     : VideoDownloader.STATES.READY,
                            listeners : [{resolve, reject}]
                        });
                    }
                    this.executeNext();
                });
        });
    }
    
    getReadyJobs() {
        return this.jobs.filter(({ state }) => state === VideoDownloader.STATES.READY);
    }

    getProcessingJobs() {
        return this.jobs.filter(({ state }) => state === VideoDownloader.STATES.PROCESSING);
    }

    executeNext() {
        if (this.getProcessingJobs().length < VideoDownloader.CONCURRENCY) {
            const next = this.getReadyJobs()[0];
            if (next) {
                next.state = VideoDownloader.STATES.PROCESSING;
                download(next.id)
                    .then(() => {
                        next.listeners.forEach(({ resolve }) => resolve());
                        this.deleteJob(next.id);
                        this.executeNext();
                    }).catch((err) => {
                        next.listeners.forEach(({ reject }) => reject(err));
                        this.deleteJob(next.id);
                        this.executeNext();
                    });
            }
        }
    }


    deleteJob(videoId: string) {
        this.jobs = this.jobs.filter(({ id }) => id !== videoId);
    }
}


export default new VideoDownloader();