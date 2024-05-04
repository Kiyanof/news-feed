import logger from '../config/logger';
import NEWS_CONFIG from '../config/news.conf';
abstract class Newspaper {

    private _API_KEY: string
    private _ENDPOINT: string
    private _URL: string
    private _query: string
    
    constructor(
        API_KEY: string,
        ENDPOINT: string,
        URL: string,
    ) {
        logger.debug('Newspaper class init...')

        this._API_KEY = API_KEY
        logger.debug(`API_KEY: ${this._API_KEY}`)
        this._ENDPOINT = ENDPOINT
        logger.debug(`ENDPOINT: ${this._ENDPOINT}`)
        this._URL = URL
        logger.debug(`URL: ${this._URL}`)
        this._query = ''
        logger.debug(`query: ${this._query}`)
    }
}

/**
 * Newsdata class
 * @extends Newspaper
 * @constructor
 * @param {void}
 * @returns {void}
 * @description Newsdata class
 * @example new Newsdata()
 * @returns {void}
 * @memberof backend/newsFeedService/src/utils/Newspaper
 * @see {@link Newsapi}
 * @see {@link Gnews}
 * @see {@link Newspaper}
 * @since 1.0.0
 * @version 1.0.0
 */
class Newsdata extends Newspaper {

    constructor() {
        super(NEWS_CONFIG.NEWSDATA.API_KEY, ENDPOINT, URL)
    }
}

class Newsapi extends Newspaper {
    constructor() {
        super(NEWS_CONFIG.NEWSAPI.API_KEY, ENDPOINT, URL)
    }
}

class Gnews extends Newspaper {

    constructor() {
        super(NEWS_CONFIG.GNEWS .API_KEY, ENDPOINT, URL)
    }
}

export { Newsdata, Newsapi, Gnews };