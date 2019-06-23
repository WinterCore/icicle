
declare namespace Entities {
    export interface User extends Document {
        name       : string;
        googleId   : string;
        picture    : string;
        email      : string;
        token      : string;
        following? : string[];
    }
}
