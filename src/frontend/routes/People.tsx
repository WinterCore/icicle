import * as React from "react";

import HeartIcon from "../icons/Heart";
import PlayIcon  from "../icons/Play";

function People() {
    return (
        <div className="people-section">
            <div className="person-outer">
                <div className="person">
                    <div className="person-image"><img src="https://lh3.googleusercontent.com/-PBe6pQcjbys/AAAAAAAAAAI/AAAAAAAABd8/IagPavlue5w/photo.jpg" /></div>
                    <div className="person-middle-outer">
                        <div className="person-info">
                            <span className="person-name">Winter Core</span>&nbsp;<span className="washed-out">is listening to</span>&nbsp;<span className="person-listening-to">Heart attack by Demi Lovato</span>
                        </div>
                        <div className="person-music-bar">
                            <div />
                        </div>
                    </div>
                    <div className="person-actions">
                        <HeartIcon />
                        <PlayIcon />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default People;