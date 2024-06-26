const QDRANT_CONFIG = {
    PROTOCOL: process.env.QDRANT_PROTOCOL || 'http',
    HOST: process.env.QDRANT_HOST || 'localhost',
    PORT: process.env.QDRANT_PORT || 6333,

    DEFAULTS: {
        COLLECTION: {
            SIZE: 384 * 2, // Because of fast_embed.py model (news title + news content + news keyword)
            DISTANCE: 'Cosine',
            ON_DISK_PAYLOAD: true,
            DATA_TYPE: 'Float32'
        },

        RELEVANT_DISTANCE: 0.5,
        RELEVANT_TOP: 10,
        RELEVANT_SOME_COUNT: 5,
        RELEVANT_MIN_SCORE: 0.5,

        CHUNK_SIZE: 10,
        BATCH_SIZE: 10,

        BLUEBIRD_CONCURRENCY: 5
    }
    ,
    NEWS_EXPIRE: process.env.NEWS_EXPIRE || 60 * 60 * 24 * 30, //  30 days
}

export interface QDrantControllerDefaults {

    collection: {
        size: number;
        distance: string;
        on_disk_payload: boolean;
        data_type: string;
    }

    relevantDistance: number;
    relevantTop: number;
    relevantSomeCount: number;
    chunkSize: number;
    batchSize: number;
  
    bluebird_concurrency: number;
  }

export const QDRANT_URL = `${QDRANT_CONFIG.PROTOCOL}://${QDRANT_CONFIG.HOST}:${QDRANT_CONFIG.PORT}`
export const DEFAULTS = QDRANT_CONFIG.DEFAULTS
export default QDRANT_CONFIG;