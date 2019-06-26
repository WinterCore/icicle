export default class ValidationError extends Error {
    errors: any

    constructor(errors : any) {
        super();
        this.errors = errors;

        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    toString(): string { return this.errors.join(", "); }
}