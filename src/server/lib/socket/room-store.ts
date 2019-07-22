

class RoomStore {
    private rooms: Map<String, Set<string>> = new Map();

    addListener(room: string, listener: string) {
        let listeners = this.rooms.get(room);
        if (!listeners) {
            listeners = new Set();
            this.rooms.set(room, listeners);
        }
        listeners.add(listener);
    }

    removeListener(room: string, listener: string) {
        const listeners = this.rooms.get(room);
        if (listeners) listeners.delete(listener);
    }

    doesRoomContainListener(room: string, listener: string) {
        const listeners = this.rooms.get(room);
        return listeners && listeners.has(listener);
    }

    purgeRoom(room: string) {
        this.rooms.delete(room);
    }
}

export default new RoomStore();