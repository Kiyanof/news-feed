/**
 * Custom Error class for not found errors.
 * @extends {Error}
 */
class UnauthorizedError extends Error {
    /**
     * Creates a new UnauthorizedError.
     * @param {string} [message] - The error message.
     */
    constructor(message?: string) {
        super(message);
        this.name = "UnauthorizedError";
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export default UnauthorizedError;