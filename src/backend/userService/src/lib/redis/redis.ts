import logger from "../../config/logger";
import { REDIS_URI } from "../../config/redis.config";
import RedisClient from "@redis/client/dist/lib/client";
import { RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "redis";

type Client = RedisClient<RedisModules, RedisFunctions, RedisScripts>
type Connection = RedisClientType<RedisModules, RedisFunctions, RedisScripts>

class RedisController {

    private _client: Client;
    private _connection: Connection | null = null
    private _isConnected: boolean = false
    private static _instance: RedisController;

    public static new(): RedisController {
        logger
        if (!RedisController._instance) RedisController._instance = new RedisController();
        return RedisController._instance;
    }

    private constructor() {
        logger.info("Creating new RedisController instance")
        this._client = new RedisClient({url: REDIS_URI,});
    }

    public async connect(): Promise<Connection | null>{
        try {
            if(!this._isConnected) {
                this._connection = await this._client.connect();
                logger.info(`Connected to Redis: ${this._connection}`)
                this._isConnected = true
                return this._connection
            }   
            logger.warn("Already connected to Redis")
            return this._connection
        } catch (error) {
            logger.error(`Error connecting to Redis: ${error}`)
            return null
        }
    }

    private async disconnect(): Promise<boolean> {
        try {
            if(this._isConnected) {
                await this._client.disconnect();
                logger.info("Disconnected from Redis")
                this._isConnected = false
                return true
            }
            logger.warn("Already disconnected from Redis")
            return true
        } catch (error) {
            logger.error(`Error disconnecting from Redis: ${error}`)
            return false
        }
    }

    public async destroy(): Promise<void> {
        try {
            logger.info("Destroying RedisController...")
            this.disconnect()
            logger.info("Destroyed RedisController")
        } catch (error) {
            logger.error(`Error destroying RedisController: ${error}`)
        }
    }
    
}

export default RedisController;