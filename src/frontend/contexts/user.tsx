import * as React from "react";

import api from "../api";

const { useState, useContext, createContext, useMemo } = React;

const UserContext = createContext<UserProvider | null>(null);

interface UserProvider {
    login  (user: Entities.User) : void;
    logout ()                    : void;
    update (data: any)           : void;

    user : Entities.User | null;
}

const UserProvider: React.FunctionComponent = (props) => {
    const [user, setUser] = useState<Entities.User | null>(() => {
        const user = window.localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    });
    
    if (user) api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

    const context = useMemo(() => {
        const login = (user: Entities.User) => {
            setUser(user);
            window.localStorage.setItem("user", JSON.stringify(user));
            api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
        };

        const logout = () => {
            setUser(null);
            window.localStorage.removeItem("user");
            delete api.defaults.headers.common["Authorization"];
        };

        const update = (data: any) => {
            const newUser = { ...user, ...data };
            setUser(newUser);
            window.localStorage.setItem("user", JSON.stringify(newUser));
        };

        return  {
            login,
            logout,
            update,
            user
        };
    }, [user]);

    

    return <UserContext.Provider value={ context } { ...props } />;
}

function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a component that's rendered within the UserProvider");
    }
    return context;
}

export {
    UserProvider,
    useUser
};