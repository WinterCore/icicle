export default class ValidationError extends Error {
    errors: string[]

    constructor(errors : string[]) {
        super();
        this.errors = errors;

        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    toString(): string { return this.errors.join(", "); }
}