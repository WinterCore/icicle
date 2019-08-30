import * as React from "react";

import { useNotification } from "../contexts/notification";

import CrossIcon from "../icons/Cross";
import CheckIcon from "../icons/Check";

const Notification: React.FunctionComponent = () => {
    const { notifications, removeNotification, completeNotification } = useNotification();

    React.useEffect(() => {
        notifications.forEach((notification) => {
            if (!notification.done) {
                completeNotification(notification.id);
                setTimeout(() => removeNotification(notification.id), notification.time);
            }
        });
    });

    return (
        <div className="notification-container">
            {
                notifications.map(not => (
                    <div key={ not.id } className="notification-outer">
                        <div className="notification-icon">{ not.type === "error" ? <CrossIcon /> : <CheckIcon /> }</div>
                        <div className="notification-message" dangerouslySetInnerHTML={{ __html : not.message }}></div>
                    </div>
                ))
            }
        </div>
    );
};

export default Notification;