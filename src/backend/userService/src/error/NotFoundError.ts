/**
 * Custom Error class for not found errors.
 * @extends {Error}
 */
class NotFoundError extends Error {
    /**
     * Creates a new NotFoundError.
     * @param {string} [message] - The error message.
     */
    constructor(message?: string) {
        super(message);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export default NotFoundError;