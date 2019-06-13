export default class Unauthenticated extends Error {
    constructor() {
        super();

        Object.setPrototypeOf(this, Unauthenticated.prototype);
    }
    toString() { return "Unauthenticated : we couldn't authenticate you with the server"; }
}