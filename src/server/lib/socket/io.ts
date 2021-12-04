import * as socketio from "socket.io";
import { Server }    from "http";

class IO {
    public instance: socketio.Server | null = null;

    init(server: Server) {
        this.instance = new socketio.Server(server, { transports : ["websocket"] });
        return this.instance;
    }

    getInstance() {
        return this.instance as socketio.Server;
    }
}

export default new IO();
