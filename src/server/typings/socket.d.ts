type SocketType = "GUEST" | "USER";
type SocketData = {
    id?            : string;
    type           : SocketType;
    isProcessing  ?: boolean;
    currentRoomId? : string;
};