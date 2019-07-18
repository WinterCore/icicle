import * as React             from "react";
import { RouteChildrenProps } from "react-router";

import useBooleanSwitch    from "../hooks/use-boolean-switch";
import { useUser }         from "../contexts/user";
import { UPDATE_SETTINGS } from "../api";
import LoaderIcon from "../icons/Loader";

const Settings: React.FunctionComponent<RouteChildrenProps> = () => {
    const { user, update } = useUser();
    const { error, isLoading, state, success, updateState } = useBooleanSwitch(user.settings.invisMode, UPDATE_SETTINGS, "invisMode");
    
    React.useEffect(() => {
        if (success) update({ settings : { invisMode : state } });
    }, [success]);

    return (
        <div className="settings-section">
            <h2 className="heading">General</h2>
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