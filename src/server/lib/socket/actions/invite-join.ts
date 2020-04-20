import Invite from "../../../database/models/invite";

import join from "./join";

import { SOCKET_ACTIONS } from "../../../../constants";

export default async function inviteJoin(socket: IcicleSocket, token: string) {
    const invite = await Invite.findOne({ token });
    if (invite) {
        if (invite.endsAt.getTime() > Date.now()) {
            join(socket, invite.user.toString(), true);
        } else {
            socket.emit(SOCKET_ACTIONS.ERROR, "The invite link you're trying to use is expired");
        }
    } else {
        socket.emit(SOCKET_ACTIONS.ERROR, "The invite link you're trying to use is invalid");
    }
}