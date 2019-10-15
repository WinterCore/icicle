export default class NotFound extends Error {
    message: string;

    constructor(message: string = "NotFound : we couldn't find what you were looking for") {
        super();
        this.message = message;
        Object.setPrototypeOf(this, NotFound.prototype);
    }
    toString(): string { return this.message; }
}