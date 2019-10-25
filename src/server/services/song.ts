
import Song from "../database/models/song";
import { download } from "../lib/audio";
import { info } from "../lib/youtube";



export const getSong = async (videoId: string): Promise<Database.Song> => {
    let data = await Song.findOne({ videoId });
    await download(videoId);
    if (!data) {
        const youtubeData = (await info([videoId])).items[0];
        data = new Song({
            title     : youtubeData.title,
            videoId   : videoId,
            thumbnail : youtubeData.thumbnail,
            duration  : youtubeData.duration
        });
        data.save();
    }
    return data;
};