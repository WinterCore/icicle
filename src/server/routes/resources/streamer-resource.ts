import { Request } from "express";
import { curry }   from "ramda";

const streamerResource = curry((req: Request, user) => ({
    _id           : user._id,
    name          : user.name,
    picture       : user.picture,
    liveListeners : user.liveListeners,
    nowPlaying    : {
        title    : user.nowPlaying.title,
        url      : user.nowPlaying.url,
        videoId  : user.nowPlaying.videoId,
        duration : user.nowPlaying.duration,
        startAt  : user.getNowPlayingCurrentTime()
    }
}));

export default streamerResource;