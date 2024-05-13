import { Redis } from "ioredis";
import logger from "../../config/logger";
import { REDIS_URI } from "../../config/redis.config";
import { Frequency } from "../../utils/subscriber";

class Caching {

    private static _counter: number = 0;
    private _redis: Redis;

    constructor() {
        logger.defaultMeta = { label: 'caching ' };
        logger.info('Initializing caching...')

        try {
            this._redis = new Redis(REDIS_URI)
            Caching._counter++;
        } catch (error) {
            logger.error(`error while initializing caching: ${error}`)
        }
    }

    private calcSeconds(frequency: Frequency) {
        switch (frequency) {
            case Frequency.DAILY:
                return 60 * 60 * 24
            case Frequency.WEEKLY:
                return 60 * 60 * 24 * 7
            case Frequency.MONTHLY:
                return 60 * 60 * 24 * 30
            default:
                return 60 * 60 * 24
        }
    }

    public async cacheUserNews(
        {email, frequency}:{email: string, frequency: Frequency}, 
        {summery, newsID}:{summery: string, newsID: Array<string>}
    ): Promise<boolean> {
        logger.info(`Caching news for ${email}...`)
        try {
            this._redis.hset(email, new Date().toDateString(), JSON.stringify({summery, newsID}))
            logger.debug(`News cached for ${email}`)
            this._redis.expire(email, this.calcSeconds(frequency))
            logger.debug(`Cache will expire in ${this.calcSeconds(frequency)} seconds`)
            return true
        } catch (error) {
            logger.error(`Error caching news for ${email}: ${error}`)
            return false
        }
    }

    destroy() {
        logger.info('Destroying caching...')
        this._redis.disconnect();
        Caching._counter--;
        logger.defaultMeta = { label: '' };
    }

}

export default Caching