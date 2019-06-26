export default class NotFound extends Error {
    constructor() {
        super();

        Object.setPrototypeOf(this, NotFound.prototype);
    }
    toString(): string { return "NotFound : we couldn't find what you were looking for"; }
}