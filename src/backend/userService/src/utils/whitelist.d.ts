import Tokenizer from "../lib/auth/tokenizer";
import Whitelist from "../lib/redis/whitelist";
/**
 * Creates a new Whitelist instance.
 *
 * @param {Tokenizer} tokenizer - The tokenizer instance to be used.
 * @returns {Promise<Whitelist>} A promise that resolves to a Whitelist instance.
 */
export declare function createWhitelist(tokenizer: Tokenizer): Promise<Whitelist>;