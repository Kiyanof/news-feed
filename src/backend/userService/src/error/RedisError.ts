/**
 * Custom Error class for not found errors.
 * @extends {Error}
 */
class RedisError extends Error {
    /**
     * Creates a new RedisError.
     * @param {string} [message] - The error message.
     */
    constructor(message?: string) {
        super(message);
        this.name = "RedisError";
        Object.setPrototypeOf(this, RedisError.prototype);
    }
}

export default RedisError;