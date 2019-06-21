import * as React from "react";

import Button from "./Button";

import LogoutIcon from "../icons/Logout";

import { useUser } from "../contexts/user";

import api, { GET_GOOGLE_AUTH_URL } from "../api";


const UserLoginForm: React.FunctionComponent<UserLoginFormProps> = ({ isLoggedIn }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    
    const requestLoginUrl = React.useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { data } = await api(GET_GOOGLE_AUTH_URL());
        window.location = data.url;
    }, []);

    return (
        <form className="login-with-google" onSubmit={ requestLoginUrl }>
            <Button isLoading={ isLoading } type="submit">LOGIN WITH GOOGLE</Button>
        </form>
    );
};

interface UserLoginFormProps {
    isLoggedIn: boolean
}

const UserLoginCard: React.FunctionComponent = () => {
    const { user, logout } = useUser();

    return user ? (
        <div className="user-card">
            <div className="profile-picture"><img src={ user.picture } alt="User profile picture" /></div>
            <div className="user-name">{ user.name }</div>
            <LogoutIcon onClick={ logout } />
        </div>
    ) : (
        <UserLoginForm isLoggedIn={ !!user } />
    );
};

export default UserLoginCard;