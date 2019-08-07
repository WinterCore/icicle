import * as React             from "react";
import { RouteChildrenProps } from "react-router";

import useBooleanSwitch    from "../hooks/use-boolean-switch";

import { useUser }         from "../contexts/user";

import LoaderIcon          from "../icons/Loader";

import api from "../api";

import { UPDATE_SETTINGS, GET_SETTINGS } from "../api";

const Settings: React.FunctionComponent<RouteChildrenProps> = () => {
    const { user, update }                           = useUser();
    const [isLoadingSettings, setIsLoadingSettings]  = React.useState(true);
    const { isLoading, state, success, updateState } = useBooleanSwitch(user.settings.invisMode, UPDATE_SETTINGS, "invisMode");
    
    React.useEffect(() => {
        if (success) update({ settings : { invisMode : state } });
    }, [success]);

    React.useEffect(() => {
        api({ ...GET_SETTINGS() }).then((response) => {
            setIsLoadingSettings(false);
            update({ settings : response.data.data })
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <div className="settings-section">
            <div className="heading">
                <h2 className="">General</h2>
                { isLoadingSettings && <LoaderIcon /> }
            </div>
            <div className="setting-item">
                <div className="switch-container">
                    { isLoading && <LoaderIcon /> }
                    { success && <div style={{ color : "#71ff71" }}>Saved</div> }
                    <div className="switch">
                        <input
                            type="checkbox"
                            id="invis-mode"
                            checked={ state }
                            disabled={ isLoading }
                            onChange={ ({ target : { checked } }) => updateState(checked) }
                        />
                        <label htmlFor="invis-mode" />
                    </div>
                    <div className="switch-text">
                        Invisible mode
                    </div>
                </div>
                <div className="setting-item-description washed-out">
                    Will not show you in the "people" section when you're playing something
                </div>
            </div>
        </div>
    );
};


export default Settings;