import logger from "../config/logger";
import { exec } from "child_process";
import QDrantController from "./v2/QDdrant";
import { QDRANT_URL } from "../config/qdrant.conf";
import NewsModel from "../model/news";
import { JSDOM } from 'jsdom';
import {Readability} from '@mozilla/readability';
import axios from "axios";
// import { join } from 'path';

interface NewsProps {
    title: string;
    description: string;
    content: string;
    category?: string;
    author?: string;
    keywords?: Array<string>;
    country?: string;
    language?: string;
    publishedAt?: Date;
    source?: string;
    url?: string;
}

/**
 * Represents a news article with various attributes such as title, description, content, category, author, keywords, country, language, publication date, source, and URL.
 */
class News {

    protected _qdrant: QDrantController

    /**
     * The title of the news article.
     * @type {string}
     */
    private _title: string;

    /**
     * A brief description of the news article.
     * @type {string}
     */
    private _description: string;

    /**
     * The main content of the news article.
     * @type {string}
     */
    private _content: string;

    /**
     * The category under which the news article falls.
     * @type {string}
     */
    private _category: string;

    /**
     * The author of the news article.
     * @type {string}
     */
    private _author: string;

    /**
     * An array of keywords associated with the news article.
     * @type {Array<string>}
     */
    private _keywords: Array<string>;

    /**
     * The country where the news article was published.
     * @type {string}
     */
    private _country: string;

    /**
     * The language in which the news article was published.
     * @type {string}
     */
    private _language: string;

    /**
     * The date and time when the news article was published.
     * @type {Date}
     */
    private _publishedAt: Date;

    /**
     * The source of the news article.
     * @type {string}
     */
    private _source: string;
    /**
     * The URL of the news article.
     * @type {string}
     */
    private _url: string;

    /**
     * The embedding of the news article content.
     * @type {Array<number>}
     * @private
     */
    private _embedding: Float32Array;

    /**
     * Constructs a new instance of the News class.
     */
    constructor({...props}: NewsProps){        
        logger.defaultMeta = { label: 'News ' };
        logger.info('Creating a new instance of the News class');

        this._qdrant = new QDrantController(QDRANT_URL);

        this._title = props.title ?? 'unknown';
        logger.debug(`Title: ${this._title}`);
        this._description = props.description ?? 'unknown';
        logger.debug(`Description: ${this._description}`);
        this._content = props.content ?? 'unknown';
        logger.debug(`Content: ${this._content}`);
        this._category = props.category ?? 'unknown';
        logger.debug(`Category: ${this._category}`);
        this._author = props.author ?? 'unknown';
        logger.debug(`Author: ${this._author}`);
        this._keywords = props.keywords ?? [];
        logger.debug(`Keywords: ${this._keywords}`);
        this._country = props.country ?? 'unknown';
        logger.debug(`Country: ${this._country}`);
        this._language = props.language ?? 'unknown';
        logger.debug(`Language: ${this._language}`);
        this._publishedAt = props.publishedAt ?? new Date();
        logger.debug(`Published At: ${this._publishedAt}`);
        this._source = props.source ?? 'unknown';
        logger.debug(`Source: ${this._source}`);
        this._url = props.url ?? 'unknown';
        logger.debug(`URL: ${this._url}`);
        this._embedding = new Float32Array();
        logger.debug(`Embedding: ${this._embedding}`);
    }

    private static parseStdout(stdout: string) {
        // Extract the output between the delimiters
        const startDelimiter = "---start---\n";
        const endDelimiter = "\n---end---";
        const startIndex = stdout.indexOf(startDelimiter) + startDelimiter.length;
        const endIndex = stdout.indexOf(endDelimiter);
        const output = stdout.slice(startIndex, endIndex);

        return output;
    }

    /**
     * 
     */
    private static generateEmbeddingWithFastEmbedding(content: string, kind: 'passage' | 'query' = 'passage'): Promise<Array<Number>> {
        return new Promise((resolve, _reject) => {
            exec(`. ${__dirname}/python/venv/bin/activate && python3.11 ${__dirname}/python/fast_embed.py "${content}" "${kind}"`, (error, _stdout, stderr) => {
                if (error) {
                    logger.error(`Error generating embedding, Error: ${error}`);
                    resolve([]);
                    return;
                }
                if (stderr) {
                    // logger.error(`Error generating embedding, Error: ${stderr}`);
                    // reject(new Error(stderr));
                    // return;
                    // TODO: Fix the TQDM_DISABLE in the python file to prevent this trick
                    const embedding = JSON.parse(this.parseStdout(stderr));
                    resolve(embedding);
                }
            });
        })
    }

    /**
     * Generates an embedding for the content of the news article.
     *
     * @returns An array representing the embedding.
     */
    public async generateEmbedding(): Promise<Array<Number> | null> {
        logger.info('Generating embedding for news article content');
        const content = this._content;
        const embedding = await News.generateEmbeddingWithFastEmbedding(content);
        const keywordEmbedding = await News.generateEmbeddingWithFastEmbedding(this._keywords.join(' '));
        if(embedding) {
            this._embedding = Float32Array.from([...Float32Array.from(embedding as Array<number>), ...Float32Array.from(keywordEmbedding as Array<number>)])
            logger.debug(`Embedding Length: ${embedding.length}`);
            return embedding;
        }
        return null
    }

    public static async generateStaticEmbedding(content: string, kind: 'passage' | 'query' = 'passage'): Promise<Float32Array | null> {
        logger.info('Generating embedding for news article content');
        logger.debug(`Content length: ${content.length}`)
        const embedding = await News.generateEmbeddingWithFastEmbedding(content, kind);
        if(embedding) {
            const result = Float32Array.from(embedding as Array<number>)
            logger.debug(`Embedding Length: ${embedding.length}`);
            return result;
        }
        return null
    }

    private removeHTMLTags(text: string) {
        const withoutTags = text.replace(/<[^>]*>?/gm, '');
        const withoutExtraSpaces = withoutTags.replace(/\s+/gm, ' ');
        const withoutQuotes = withoutExtraSpaces.replace(/"/g, '');
        return withoutQuotes;
    }

    public async scrapeContent() {
        try {
            const response = await axios.get(this._url);
            const dom = new JSDOM(response.data, { url: this._url });
            const reader = new Readability(dom.window.document); // DANGER: Becareful about IP blocking
            const article = reader.parse();
            if(article) {
                const content = this.removeHTMLTags(article.content);
                this._content = content
                logger.debug(`Whole Content length: ${content.length}`);
                return content
            }
            return "";
        } catch (error) {
            console.error(`Error scraping content from ${this._url}: ${error}`);
            return null; 
        }
    }

    /**
     * JSON Format Add to mongodb
     */
    private async saveToDB() {
        logger.info('Saving news article to DB');
        try {
            const result = await new NewsModel(this.toJSON()).save();
            logger.info('News article saved to DB');
            return result;
        } catch (error) {
            logger.error(`Error saving news article to DB: ${error}`);
            return null;
        }
    }



    /**
     * Embedding & newsid add to qdrant
     */
    private async saveToQDrant(_id: string) {
        logger.info('Saving news article to QDrant');
        try {
            const embedding = this._embedding;
            const result = await this._qdrant.addDocument('news', embedding, _id, this._publishedAt ?? new Date())
            logger.info('News article saved to QDrant');
            return result;
        } catch (error) {
            logger.error(`Error saving news article to QDrant: ${error}`);
            return null;
        }
    }

    public async save() {
        logger.info('Saving news article');
        const result = await this.saveToDB();
        if(result) {
            const _id = result._id;
            logger.debug(`_id: ${_id}`);
            const qdrantResult = await this.saveToQDrant(_id.toString());
            logger.debug(`qdrantResult: ${qdrantResult}`);
            return qdrantResult;
        }
        return null;
    }

    private static async readNews(query: string, frequency: "daily" | "weekly" | "monthly" = 'daily') {
        logger.info('Reading news...');
        try {
            const qdrantController = new QDrantController(QDRANT_URL)
            const embeddedQuery = await News.generateStaticEmbedding(query);
            logger.debug(`Embedded Query length: ${embeddedQuery?.length}`)
            logger.debug(`Embedded Query is array: ${Array.isArray(embeddedQuery)}`)
            if(!embeddedQuery) throw new Error('Error generating embedding for query');
            const result = qdrantController.findRelevantDocuments('news', embeddedQuery, 10, frequency);
            return result;
        } catch (error) {
            logger.error(`Error reading news: ${error}`);
            return null;
        }
    }

    public static async readDailyNews(query: string) {
        return News.readNews(query, 'daily');
    }

    static readWeeklyNews(query: string) {
        return News.readNews(query, 'weekly');
    }

    static readMonthlyNews(query: string) {
        return News.readNews(query, 'monthly');
    }

    /**
     * Formats
     */
    toJSON() {
        return {
            title: this._title,
            description: this._description,
            content: this._content,
            // category: this._category,
            // author: this._author,
            // keywords: this._keywords,
            // country: this._country,
            // language: this._language,
            publishedAt: this._publishedAt,
            // source: this._source,
            url: this._url,
        }
    }
    
}

export default News;