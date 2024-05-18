import logger from '../config/logger';
import NEWS_CONFIG from '../config/news.conf';
import axios from 'axios';
import News from './News';
import { IGnews, INewsapi, INewsdata, INewsdataArticle } from './interface/news';
import NewsModel from '../model/news';
import QDrantController from './v2/QDdrant';
import { QDRANT_URL } from '../config/qdrant.conf';

abstract class Newspaper {

    protected _news: Array<News>

    private _name: string

    private _API_KEY: string
    private _ENDPOINT: string
    private _URL: string
    protected _query: string
    
    constructor(
        API_KEY: string,
        ENDPOINT: string,
        URL: string,
    ) {
        logger.debug('Newspaper class init...')

        this._name = this.constructor.name
        this._news = []

        logger.debug(`name: ${this._name}`)
        this._API_KEY = API_KEY
        logger.debug(`API_KEY: ${this._API_KEY}`)
        this._ENDPOINT = ENDPOINT
        logger.debug(`ENDPOINT: ${this._ENDPOINT}`)
        this._URL = `${URL}/${this._ENDPOINT}?apikey=${this._API_KEY}` // NOTE: newsapi use camelCase for apiKey
        logger.debug(`URL: ${this._URL}`)
        this._query = ''
        logger.debug(`query: ${this._query}`)
    }

    public async update() {
        logger.debug(`Updating ${this._name}...`)
        try {
            const url = `${this._URL}${this._query ?? ''}`
            logger.debug(`url: ${url}`)
            const response = await axios.get(url)
            logger.debug(`response: ${response}`)
            return response.data
        } catch (error) {
            logger.error(`Error updating ${this._name}: ${error}`)
            return null
        }
    }

    protected async save() {
        logger.debug(`Saving ${this._name} to DB...`)
        for (const news of this._news) {
            await news.save()
        }
        logger.info(`${this._name} saved to DB`)
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
        super(NEWS_CONFIG.NEWSDATA.API_KEY, NEWS_CONFIG.NEWSDATA.ENDPOINT, NEWS_CONFIG.NEWSDATA.PATH)
    }

    private toPage(page?: string) {
        if (page) {
            if(this._query.includes('page=')){
                this._query = this._query.replace(/page=[a-zA-z0-9]+/, `page=${page}`)
            } else {
                this._query = `${this._query}&page=${page}`
            }
            logger.debug(`query: ${this._query}`)
        }
    }

    private async gatherFromPages(start: number, end: number) {
        let allArticles: Array<INewsdataArticle> = []
        let total = 0
        let next = ''
        for (let i = start; i < end; i++) {
            this.toPage(i !== 0 ? next : undefined)

            const result = await this.update() as INewsdata

            if (!result && i === 0) {
                return {
                    totalResults: 0,
                    results: []
                }
            }
            if (!result) break;
            const {totalResults, results, nextPage} = result
            if(i === 0) total = totalResults
            next = nextPage ?? ''
            allArticles = allArticles.concat(results)
        }
        return {
            totalResults: total,
            results: allArticles
        }
    }

    async syncNews() {
        logger.debug('syncNews...')
        try {
            const {totalResults, results} = await this.gatherFromPages(0, +NEWS_CONFIG.NEWSDATA.MAX/10)
            if (!totalResults || !results) return

            for (const article of results) {
                const news = new News({...article, url: article.link})
                this._news.push(news)
                await news.generateEmbedding()
                await news.save()
            }
            logger.info(`Newsdata: ${this._news.length} news saved`)
        } catch (error) {
            logger.error(`Error syncing news: ${error}`)  
        }
    }
}

class Newsapi extends Newspaper {
    constructor() {
        super(NEWS_CONFIG.NEWSAPI.API_KEY, NEWS_CONFIG.NEWSAPI.ENDPOINT , NEWS_CONFIG.NEWSAPI.PATH)
        this._query = '&language=en'
    }

    async syncNews() {
        logger.debug('syncNews...')
        try {
            const {totalResults, articles} = await this.update() as INewsapi

            if (!totalResults || !articles) return

            for (const article of articles) {
                const news = new News({...article})
                this._news.push(news)
                await news.generateEmbedding()
                await news.save()
            }
            logger.info(`Newsapi: ${this._news.length} news saved`)
        } catch (error) {
            logger.error(`Error syncing news: ${error}`)
        }
    }
}

class Gnews extends Newspaper {

    constructor() {
        super(NEWS_CONFIG.GNEWS .API_KEY, NEWS_CONFIG.GNEWS.ENDPOINT, NEWS_CONFIG.GNEWS.PATH)
    }

    async syncNews() {
        logger.debug('syncNews...')
        try {
            const {totalArticles, articles} = await this.update() as IGnews

            if (!totalArticles || !articles) return

            for (const article of articles) {
                const news = new News({...article})
                this._news.push(news)
                await news.generateEmbedding()
                await news.save()
            }
            logger.info(`Gnews: ${this._news.length} news saved`)
        } catch (error) {
            logger.error(`Error syncing news: ${error}`)
        }

    }
}

class NewsController {
    
    private _newsdata: Newsdata
    private _newsapi: Newsapi
    private _gnews: Gnews

    constructor() {
        this._newsdata = new Newsdata()
        this._newsapi = new Newsapi()
        this._gnews = new Gnews()
    }

    private get _newsdataActive() {
        return NEWS_CONFIG.NEWSDATA.ACTIVE
    }

    private get _newsapiActive() {
        return NEWS_CONFIG.NEWSAPI.ACTIVE
    }

    private get _gnewsActive() {
        return NEWS_CONFIG.GNEWS.ACTIVE
    }

    private async dropNewsCollectionFromDB() {
        logger.debug('dropNewsCollectionFromDB...')
        try {
            await NewsModel.collection.drop()
            logger.info('News collection dropped')
        } catch (error) {
            logger.error(`Error dropping news collection: ${error}`)
        }
    }

    private async dropNewsCollectionFromQDrant() {
        logger.debug('dropNewsCollectionFromQDrant...')
        try {
            await new QDrantController(QDRANT_URL).dropCollection('news')
            logger.info('News collection dropped from QDrant')
        } catch (error) {
            logger.error(`Error dropping news collection from QDrant: ${error}`)
        }
    }

    private async dropNewsCollection() {
        logger.debug('dropNewsCollection...')
        await this.dropNewsCollectionFromDB()
        await this.dropNewsCollectionFromQDrant()
    }

    private async createMongoCollection() {
        logger.debug('createMongoCollection...')
        try {
            await NewsModel.createCollection()
            logger.info('News collection created')
        } catch (error) {
            logger.error(`Error creating news collection: ${error}`)
        }
    }

    private async createQDrantCollection() {
        logger.debug('createQDrantCollection...')
        try {
            await new QDrantController(QDRANT_URL).createCollection('news')
            logger.info('News collection created in QDrant')
        } catch (error) {
            logger.error(`Error creating news collection in QDrant: ${error}`)
        }
    }

    private async createNewsCollection() {
        logger.debug('createNewsCollection...')
        await this.createMongoCollection()
        await this.createQDrantCollection()
    }

    private async resetNewsCollection() {
        logger.debug('resetNewsCollection...')
        try {
            await this.dropNewsCollection()
            await this.createNewsCollection()
            // logger.info('News collection reset')
        } catch (error) {
            logger.error(`Error resetting news collection: ${error}`)
        }
    }

    async syncNews() {
        logger.debug('syncNews...')
        if(
            +(process.env.RESET_NEWS || 0) === 1
        ) {
            await this.resetNewsCollection()
        }

        if(this._newsapiActive !== 0) {
            await this._newsapi.syncNews()
        }
        if (this._gnewsActive !== 0) {
            await this._gnews.syncNews()
        }
        if (this._newsdataActive !== 0) {
            await this._newsdata.syncNews()  // NOTE: Cause of pagination, this should be last
        }

        logger.info('News synced')
    }
}

export default NewsController;