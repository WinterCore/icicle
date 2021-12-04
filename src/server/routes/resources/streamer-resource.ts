import { Request } from "express";
import { curry }   from "ramda";
import {User} from "../../typings/database";

const streamerResource = curry((_: Request, user: User) => ({
    _id           : user._id,
    name          : user.name,
    picture       : user.picture,
    liveListeners : user.liveListeners,
    nowPlaying    : user.nowPlaying && ({
        title    : user.nowPlaying.title,
        url      : user.nowPlaying.url,
        videoId  : user.nowPlaying.videoId,
        duration : user.nowPlaying.duration,
        startAt  : user.getNowPlayingCurrentTime()
    })
}));

export default streamerResource;
