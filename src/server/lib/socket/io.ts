import * as socketio from "socket.io";
import { Server }    from "http";

class IO {
    public instance: SocketIO.Server|null = null;

    init(server: Server) {
        this.instance = socketio(server, { transports : ["websocket"] });
        return this.instance;
    }

    getInstance() {
        return this.instance as SocketIO.Server;
    }
}

export default new IO();