export default class Unauthorized extends Error {
    constructor() {
        super();

        Object.setPrototypeOf(this, Unauthorized.prototype);
    }
    toString(): string { return "Unauthorized : You are not authorized to do this action"; }
}