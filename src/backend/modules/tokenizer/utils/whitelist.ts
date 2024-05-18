import Tokenizer from "../auth/tokenizer"
import Whitelist from "../redis/whitelist"
import { redisCreateClient } from "./redis"

const createWhitelist = async (tokenizer: Tokenizer): Promise<Whitelist> => {
    const whitelist = new Whitelist(tokenizer, redisCreateClient())
    await whitelist.init()
    return whitelist
}

export {
    createWhitelist
}