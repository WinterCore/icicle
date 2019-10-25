export const SOCKET_ACTIONS = {
    END_STREAM       : "END_STREAM",
    PLAY_NOW         : "PLAY_NOW",
    PLAY             : "PLAY",              // this doesn't receive a song as an argument (it is used to play the next song in the queue)
    SEEK             : "SEEK",
    PAUSE            : "PAUSE",
    CHECK            : "CHECK",
    JOIN             : "JOIN",
    INVITE_JOIN      : "INVITE_JOIN",
    DEAD_JOIN        : "DEAD_JOIN",         // Joining a stream with nothing playing (I couldn't find a better name for this 😁)
    LEAVE            : "LEAVE",
    SKIP             : "SKIP",
    SOCKET_JOINED    : "SOCKET_JOINED",
    SOCKET_LEFT      : "SOCKET_LEFT",
    NEW_MESSAGE      : "NEW_MESSAGE",
    PROBE_LISTENERS  : "PROBE_LISTENERS",
    UPDATE_LISTENERS : "UPDATE_LISTENERS",
    ERROR            : "ERROR",
    AUTHENTICATE     : "AUTHENTICATE",
    AUTHENTICATED    : "AUTHENTICATED",
};