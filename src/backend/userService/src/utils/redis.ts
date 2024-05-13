import { Redis } from "ioredis"
import { REDIS_URI } from "../config/redis.config"

const redisCreateClient = () => {
    return new Redis(REDIS_URI)
}

export {
    redisCreateClient
}