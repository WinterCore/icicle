import Playlist from "../database/models/playlist";
import Song from "../database/models/song";
import Queue from "../database/models/queue";
import NotFound from "../errors/notfound";
import { info } from "../lib/youtube";
import { getPlaylistItems } from "../lib/youtube";

export const importYoutubePlaylist = async (playlistId: string, userId: string): Promise<{ name: string, count: number }> => {
    const rawData = await getPlaylistItems(playlistId);
    if (rawData) {
        const { data, items } = rawData;
        try {
            await Song.insertMany(
                items.map(item => ({
                    title     : item.title,
                    videoId   : item.id,
                    duration  : item.duration,
                    thumbnail : item.thumbnail
                })),
                { ordered : false }
            );
        } catch (e) { }
        await Playlist.create({
            name  : data.name,
            user  : userId,
            songs : items.map(item => item.id)
        });
        return { name : data.name, count : items.length };
    } else {
        throw new NotFound("The specified playlist doesn't exist");
    }
};

export const addSong = async (playlistId: string, videoId: string): Promise<boolean> => {
    const playlist = await Playlist.findOne({ _id : playlistId });
    if (!playlist) throw new NotFound();
    if (playlist.songs.indexOf(videoId) === -1) {
        let song = await Song.findOne({ videoId });
        if (!song) {
            const { items : [data] } = await info([videoId]);
            if (!data) { // the video doesn't exist
                throw new NotFound("The video you're trying to add doesn't exist");
            }
            song = await Song.create({
                title     : data.title,
                videoId   : videoId,
                thumbnail : data.thumbnail,
                duration  : data.duration
            });
        }
        playlist.songs.push(videoId);
        await playlist.save();
        return true;
    }
    return false;
};

export const removeSong = async (playlistId: string, videoId: string): Promise<boolean> => {
    const playlist = await Playlist.findOne({ _id : playlistId });
    if (!playlist) throw new NotFound();
    playlist.songs.splice(playlist.songs.indexOf(videoId), 1);
    playlist.save();
    return true;
};

export const addToQueue = async (playlistId: string, userId: string): Promise<number> => {
    const playlist = await Playlist.findOne({ _id : playlistId });
    if (!playlist) {
        throw new NotFound("The playlist you're trying to access doesn't exist");
    }

    const songs: Database.Song[] = await Song.find({ videoId : { $in : playlist.songs } });
    const songsToBeAdded = songs.map((song, i) => ({
        title     : song.title,
        videoId   : song.videoId,
        duration  : song.duration,
        by        : userId,
        thumbnail : song.thumbnail,
        order     : i
    }));
    Queue.create(songsToBeAdded);
    return songs.length;
};