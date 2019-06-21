export default class Unauthenticated extends Error {
    constructor() {
        super();

        Object.setPrototypeOf(this, Unauthenticated.prototype);
    }
    toString(): string { return "Unauthenticated : we couldn't authenticate you with the server"; }
}