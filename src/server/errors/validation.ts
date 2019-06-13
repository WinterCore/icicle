export default class ValidationError extends Error {
    constructor(errors : any) {
        super();
        this.errors = errors;
    }
}