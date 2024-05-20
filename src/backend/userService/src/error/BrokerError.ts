/**
 * Custom Error class for not found errors.
 * @extends {Error}
 */
class BrokerError extends Error {
    /**
     * Creates a new BrokerError.
     * @param {string} [message] - The error message.
     */
    constructor(message?: string) {
        super(message);
        this.name = "BrokerError";
        Object.setPrototypeOf(this, BrokerError.prototype);
    }
}

export default BrokerError;