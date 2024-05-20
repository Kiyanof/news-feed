/**
 * Custom Error class for not found errors.
 * @extends {Error}
 */
class ValidationError extends Error {
    /**
     * Creates a new ValidationError.
     * @param {string} [message] - The error message.
     */
    constructor(message?: string) {
        super(message);
        this.name = "ValidationError";
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export default ValidationError;