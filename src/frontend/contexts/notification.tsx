import * as React    from "react";

const { useContext, createContext, useState } = React;

const NotificationContext = createContext(null);

type NotificationType = "error" | "success";

type Notification = {
    id     ?: string;
    type   ?: NotificationType;
    message : string;
    time   ?: number;
    done   ?: boolean;
}

type NotificationContext = {
    notifications        : Notification[];
    addNotification      : {(data: Notification): void};
    removeNotification   : {(id: string): void};
    completeNotification : {(id: string): void};
};

const NotificationProvider: React.FunctionComponent = (props): React.ReactElement => {
    const [notifications, setNotifications] = useState([]);
    const addNotification = (data: Notification) => setNotifications(notifications => [...notifications, { id : `${Date.now()}`, type : "success", ...data }]);

    const removeNotification = (id: string) => setNotifications(notifications => notifications.filter(item => item.id !== id));

    const completeNotification = (id: string) => {
        const newNotifications = [...notifications];
        for (let i = 0; i < newNotifications.length; i += 1) {
            if (newNotifications[i].id === id) {
                newNotifications[i].done = true;
                break;
            }
        }
        setNotifications(newNotifications);
    };

    return <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, completeNotification }} { ...props } />;
}

function useNotification() {
    const context = useContext<NotificationContext>(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a component that's rendered within the NotificationProvider");
    }
    return context;
}

export {
    NotificationProvider,
    useNotification
};