import { Redis } from "ioredis"
import { REDIS_URI } from "../config/redis.config"

/**
 * Creates a new Redis client.
 * @returns {Redis} A new Redis client.
 */
const redisCreateClient = (): Redis => {
    return new Redis(REDIS_URI)
}

export {
    redisCreateClient
}