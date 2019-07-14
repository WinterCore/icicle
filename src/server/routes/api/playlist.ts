import { Router, Request, Response } from "express";

import { info } from "../../lib/youtube";

import Playlist from "../../database/models/playlist";
import Song     from "../../database/models/song";
import User     from "../../database/models/user";
import Queue    from "../../database/models/queue";

import authenticated        from "../middleware/authenticated";
import validatePlaylist     from "../middleware/validation/playlist";
import validatePlaylistSong from "../middleware/validation/playlist-song";

import playlistResource     from "../resources/playlist-resource";
import playlistSongResource from "../resources/playlist-song-resource";

import { co } from "../helpers";
import NotFound from "../../errors/notfound";

const router = Router();

router.get("/song/:videoId/playlists", authenticated, co(async (req: Request, res: Response) => {
    const song = await Song.findOne({ videoId : req.params.videoId, by : req.userId }, { playlists : 1 });
    return res.json({ data : song ? song.playlists : [] });
}));

router.post("/:playlistId/song", [authenticated, validatePlaylistSong], co(async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const { videoId }    = req.body;

    const oldSong = await Song.findOne({ videoId, by : req.userId });
    if (oldSong) {
        if (oldSong.playlists.indexOf(playlistId) === -1) {
            oldSong.playlists.push(playlistId);
            await oldSong.save();
        } else {
            res.status(403);
            return res.json({ errors : ["The song already exists in the specified playlist"] });
        }
    } else {
        const { items : [data] } = await info([videoId]);
        if (!data) {
            res.status(404);
            return res.json({ errors : ["The song you're trying to add doesn't exist"] });
        }
        const song = new Song({
            title     : data.title,
            videoId   : videoId,
            thumbnail : data.thumbnail,
            duration  : data.duration,
            by        : req.userId,
            playlists : [playlistId]
        });
        await song.save();
    }

    return res.json({ message : "Added successfully" });
}));

router.post("/:playlistId/queue", authenticated, co(async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    
    const songs: Database.Song[] = await Song.find({ by : req.userId, playlists : playlistId });
    const songsToBeAdded = songs.map(song => ({
        title     : song.title,
        videoId   : song.videoId,
        duration  : song.duration,
        by        : req.userId,
        thumbnail : song.thumbnail
    }));
    if (!(await User.findById(req.userId)).isStreaming()) { // if the user is not streaming (don't add the first song because it will be played immediately)
        songsToBeAdded.shift();
    }
    Queue.create(songsToBeAdded);
    return res.json({ message : `${songs.length} ${songs.length > 1 ? "songs" : "song"} ${songs.length > 1 ? "were" : "was"} successfully added to the queue` });
}));

router.delete("/:playlistId/song/:videoId", [authenticated], co(async (req: Request, res: Response) => {
    const { playlistId, videoId } = req.params;
    
    const song = await Song.findOne({ videoId, by : req.userId });
    if (!song) throw new NotFound();
    const i = song.playlists.indexOf(playlistId);
    if (i > -1) {
        song.playlists.splice(i, 1);
        if (song.playlists.length === 0) {
            await song.remove();
        } else {
            await song.save();
        }
    }
    return res.json({ message : "Deleted successfully" });
}));

router.get("/", authenticated, co(async (req: Request, res: Response) => {
    const playlists: Database.Playlist[] = await Playlist.find({ "user._id" : req.userId }).sort({ name : 1 });
    return res.json({ data : playlists.map(playlistResource(req)) });
}));

router.get("/:id/songs", authenticated, co(async (req: Request, res: Response) => {
    const songs: Database.Song[] = await Song.find({ by : req.userId, playlists : req.params.id }).sort({ title : 1 });
    return res.json({ data : songs.map(playlistSongResource(req)) });
}))

router.post("/", [authenticated, validatePlaylist], co(async (req: Request, res: Response) => {
    const { name } = req.body;
    
    const user = await User.findById(req.userId);
    const playlist = new Playlist({ name, user : { _id : user._id, name : user.name, picture : user } });

    playlist.save();

    return res.json({ data : playlistResource(req)(playlist) });
}));

router.delete("/:playlistId", [authenticated], co(async (req: Request, res: Response) => {
    const { playlistId } = req.params;

    const playlist: Database.Playlist = await Playlist.findOne({ "user._id" : req.userId, _id : playlistId });
    playlist.remove();

    const songs: Database.Song[] = await Song.find({ "by" : req.userId, playlists : playlist._id });
    for (const song of songs) {
        const i = song.playlists.indexOf(playlistId);
        song.playlists.splice(i, 1);
        if (song.playlists.length === 0) {
            await song.remove();
        } else {
            await song.save();
        }
    }
    
    return res.json({ message : `${playlist.name} was deleted successfully` });
}));

export default router;