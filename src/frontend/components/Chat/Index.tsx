import * as React from "react";

import Input from "../Input";

import SendIcon from "../../icons/Send";

import ChatMessage from "./Message";

import { usePlayer } from "../../contexts/player";
import { useSocket } from "../../contexts/socket";
import { useUser }   from "../../contexts/user";

import { SOCKET_ACTIONS } from "../../../constants";

const Chat: React.FunctionComponent = () => {
    const [text, setText]         = React.useState<string>("");
    const [messages, setMessages] = React.useState<Message[]>([]);

    const messagesContainerRef = React.useRef<HTMLDivElement>(null);

    const { socket }   = useSocket();
    const { user }     = useUser();
    const { roomData } = usePlayer();

    const onTextChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => setText(target.value);

    const handleMessageReceived = React.useCallback((message: Message) => setMessages(messages => [...messages, message]), []);

    const sendMessage = () => {
        setText("");
        setMessages(messages => [...messages, { message : text, date : Date.now(), by : { _id : user._id, name : user.name, picture : user.picture } }]);
        socket.emit(SOCKET_ACTIONS.NEW_MESSAGE, roomData._id, text);
    };

    React.useEffect(() => {
        socket.on(SOCKET_ACTIONS.NEW_MESSAGE, handleMessageReceived);
        return () => socket.off(SOCKET_ACTIONS.NEW_MESSAGE, handleMessageReceived);
    }, []);

    React.useLayoutEffect(() => {
        const { height } = messagesContainerRef.current.getBoundingClientRect();
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - height;
    }, [messages.length]);

    return (
        <>
            <h2>Chat</h2>
            <div className="chat-outer">
                <div ref={ messagesContainerRef } className="chat-messages">
                    { messages.map(message => <ChatMessage key={ message.date } { ...message } />) }
                </div>
                <div className="chat-footer">
                    <Input onChange={ onTextChange } value={ text } onEnter={ sendMessage } />
                    <SendIcon onClick={ sendMessage } />
                </div>
            </div>
        </>
    );
};

const IfChat: React.FunctionComponent = () => {
    
    const { roomData } = usePlayer();

    if (!roomData) return (
        <>
            <h2>Chat</h2>
            <h4>Please join a room first</h4>
        </>
    );

    return <Chat />
};

export default IfChat;