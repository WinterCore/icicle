export const SOCKET_ACTIONS = {
    END_STREAM    : "END_STREAM",
    PLAY_NOW      : "PLAY_NOW",
    SEEK          : "SEEK",
    PAUSE         : "PAUSE",
    PLAY          : "PLAY",
    CHECK         : "CHECK",
    JOIN          : "JOIN",
    INVITE_JOIN   : "INVITE_JOIN",
    DEAD_JOIN     : "DEAD_JOIN", // Joining a stream with nothing playing (I couldn't find a better name for this 😁)
    LEAVE         : "LEAVE",
    SKIP          : "SKIP",
    SOCKET_JOINED : "SOCKET_JOINED",
    SOCKET_LEFT   : "SOCKET_LEFT",
    NEW_MESSAGE   : "NEW_MESSAGE",
    ERROR         : "ERROR"
};