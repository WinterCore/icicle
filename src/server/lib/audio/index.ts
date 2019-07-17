import * as ytdl from "youtube-dl";
import * as path from "path";
import * as fs   from "fs";

import { AUDIO_PATH } from "../../../../config/server";

import { DOMAIN } from "../../../../config/server";
import logger     from "../../logger";

export const download = (id: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const output = path.resolve(AUDIO_PATH, `${id}.ogg`);
        fs.stat(output, (err) => {
            if (err) {
                ytdl.exec(`https://www.youtube.com/watch?v=${id}`, [
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
                    logger.info(`Youtube dl : ${id} ${stdout}`);
                    resolve(`${DOMAIN}/audio/${id}.ogg`);
                });
            } else {
                resolve(`${DOMAIN}/audio/${id}.ogg`);
            }
        });
    });
};