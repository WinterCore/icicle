import * as React from "react";

const ChatMessage: React.FunctionComponent<ChatMessageProps> = (props) => {
    const { message, by : { name, picture } } = props;
    return (
        <div className="chat-message">
            <div className="chat-message-profile-picture">
                <img src={ picture } />
            </div>
            <div className="chat-message-content">
                <div className="chat-message-user-name">
                    { name }
                </div>
                <div className="chat-message-message">
                    { message }
                </div>
            </div>
        </div>
    );
};

interface ChatMessageProps extends Message {
    
}

export default ChatMessage;