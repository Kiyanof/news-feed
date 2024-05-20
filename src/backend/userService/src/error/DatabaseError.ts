/**
 * Custom Error class for not found errors.
 * @extends {Error}
 */
class DatabaseError extends Error {
    /**
     * Creates a new DatabaseError.
     * @param {string} [message] - The error message.
     */
    constructor(message?: string) {
        super(message);
        this.name = "DatabaseError";
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export default DatabaseError;