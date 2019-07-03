import * as React from "react";

import { useNotification } from "../contexts/notification";

import CrossIcon from "../icons/Cross";
import CheckIcon from "../icons/Check";

const Notification: React.FunctionComponent = () => {
    const { notifications, removeNotification, completeNotification } = useNotification();

    React.useEffect(() => {
        notifications.forEach((not) => {
            if (!not.done) {
                completeNotification(not.id);
                setTimeout(() => removeNotification(not.id), not.time || 5000);
            }
        });
    });

    return (
        <div className="notification-container">
            {
                notifications.map(not => (
                    <div key={ not.id } className="notification-outer">
                        <div className="notification-icon">{ not.type === "error" ? <CrossIcon /> : <CheckIcon /> }</div>
                        <div className="notification-messsage">{ not.message }</div>
                    </div>
                ))
            }
        </div>
    );
};

export default Notification;