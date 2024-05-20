import Tokenizer from "../lib/auth/tokenizer"
import Whitelist from "../lib/redis/whitelist"
import { redisCreateClient } from "./redis"

/**
 * Creates a new Whitelist instance.
 * 
 * @param {Tokenizer} tokenizer - The tokenizer instance to be used.
 * @returns {Promise<Whitelist>} A promise that resolves to a Whitelist instance.
 */
const createWhitelist = async (tokenizer: Tokenizer): Promise<Whitelist> => {
    const client = redisCreateClient();
    const whitelist = new Whitelist(tokenizer, client)
    await whitelist.init()
    return whitelist
}

export {
    createWhitelist
}