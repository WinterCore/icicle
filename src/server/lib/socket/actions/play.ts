import User   from "../../../database/models/user";

import Scheduler from "../scheduler";
import RoomStore from "../room-store";

export default async function play(socket: IcicleSocket) {
    const { id, currentRoomId } = socket.user;
    if (!id) {
        return;
    }
    const user = await User.findById(id) as Database.User;
    if (user.isStreaming()) {
        return;
    }

    /**
     * If the user is in another stream make him leave it and join his own room
     */
    if (currentRoomId && currentRoomId !== id) {
        RoomStore.removeListener(currentRoomId, id);
        socket.leave(currentRoomId);
        socket.join(id);
        socket.user.currentRoomId = id;
    }

    Scheduler.emit("schedule-next", { user, duration : 0 });
}