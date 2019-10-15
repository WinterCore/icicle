import { Router, Request, Response } from "express";

import Playlist from "../../database/models/playlist";
import Song     from "../../database/models/song";
import User     from "../../database/models/user";

import authenticated        from "../middleware/authenticated";
import validatePlaylist     from "../middleware/validation/playlist";
import validatePlaylistSong from "../middleware/validation/playlist-song";

import playlistResource     from "../resources/playlist-resource";
import playlistSongResource from "../resources/playlist-song-resource";

import * as PlaylistService from "../../services/playlist";

import { co } from "../helpers";
import NotFound from "../../errors/notfound";
import ValidationError from "../../errors/validation";

const router = Router();

/**
 * Import a youtube playlist
 */
router.post("/youtube/import", authenticated, co(async (req: Request, res: Response) => {
    const user = await User.findById(req.userId) as Database.User;
    if (user.limits.lastPlaylistImport.getTime() > Date.now() - 1000 * 60 * 60 * 24) {
        throw new ValidationError(["You can only import 1 playlist per day"]);
    }
    PlaylistService.importYoutubePlaylist(req.body.playlistId, req.userId);
    user.limits.lastPlaylistImport = new Date();
    user.save();
    res.json({ message : "Your playlist has been added to the import queue and will be imported soon" });
}));


/**
 * Get all playlists ids that have a specific song
 */
router.get("/song/:videoId/playlists", authenticated, co(async (req: Request, res: Response) => {
    const playlists = await Playlist.find({ user : req.userId, songs : req.params.videoId }, { _id : 1 });
    return res.json({ data : playlists.map(item => item._id) });
}));

/**
 * Add a song to a specific playlist
 */
router.post("/:playlistId/song", [authenticated, validatePlaylistSong], co(async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const { videoId }    = req.body;
    await PlaylistService.addSong(playlistId, videoId);
    return res.json({ message : "Added successfully" });
}));

/**
 * Add an entire playlist to the queue
 */
router.post("/:playlistId/queue", authenticated, co(async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    
    const count = await PlaylistService.addToQueue(playlistId, req.userId);

    return res.json({ message : `${count} ${count > 1 ? "songs" : "song"} ${count > 1 ? "were" : "was"} successfully added to the queue` });
}));

/**
 * Remove a song from a playlist
 */
router.delete("/:playlistId/song/:videoId", [authenticated, validatePlaylistSong], co(async (req: Request, res: Response) => {
    const { playlistId, videoId } = req.params;

    PlaylistService.removeSong(playlistId, videoId);
    return res.json({ message : "Deleted successfully" });
}));

/**
 * Get all the playlists for the logged in user
 */
router.get("/", authenticated, co(async (req: Request, res: Response) => {
    const playlists: Database.Playlist[] = await Playlist.find({ user : req.userId }).sort({ name : 1 });
    return res.json({ data : playlists.map(playlistResource(req)) });
}));

/**
 * Get all the songs in a specific playlist
 */
router.get("/:playlistId/songs", authenticated, co(async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findOne({ _id : playlistId });
    if (!playlist) {
        throw new NotFound("The specified playlist doesn't exist");
    }
    const songs: Database.Song[] = await Song.find({ videoId : { $in : playlist.songs } }).sort({ title : 1 });
    return res.json({ data : songs.map(playlistSongResource(req)) });
}))

/**
 * Create a new playlist for the logged in user
 */
router.post("/", [authenticated, validatePlaylist], co(async (req: Request, res: Response) => {
    const { name } = req.body;
    const playlist = await Playlist.create({ name, user : req.userId });
    return res.json({ data : playlistResource(req)(playlist) });
}));

/**
 * Delete a specific playlist
 */
router.delete("/:playlistId", [authenticated], co(async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findOne({ user : req.userId, _id : playlistId });
    if (!playlist) {
        throw new NotFound("The specified playlist was not found");
    }
    await playlist.remove();
    return res.json({ message : `${playlist.name} has been deleted successfully` });
}));

export default router;