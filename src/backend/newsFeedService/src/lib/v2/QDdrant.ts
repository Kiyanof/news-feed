import QDRANT_CONFIG, {
  DEFAULTS,
  QDrantControllerDefaults,
} from "../../config/qdrant.conf";
import logger from "../../config/logger";
// import axios from "axios";
// import bluebird from "bluebird";
import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from 'uuid';

class QDrantController {
  private _url: string;
  private _default: QDrantControllerDefaults;
  private _client: any;

  constructor(url: string) {
    logger.defaultMeta = {
      Controller: "QDrantController",
      Procedure: "constructor",
    };
    logger.info("Creating a new instance of the QDrantController class");
    this._url = url;
    logger.debug(`URL: ${this._url}`);

    this._default = this.initDefaultValues();
    logger.debug(`Defaults: ${this._default}`);

    this._client = new QdrantClient({
      host: QDRANT_CONFIG.HOST,
      port: QDRANT_CONFIG.PORT,
    });
    logger.debug(`Client: ${this._client}`);

    logger.info("New instance of the QDrantController class created");
  }

  private initDefaultValues() {
    logger.defaultMeta = { Procedure: "initDefaultValues" };
    logger.info("Initializing default values...");
    const defaultValues: QDrantControllerDefaults = {
      collection: {
        size: DEFAULTS.COLLECTION.SIZE,
        distance: DEFAULTS.COLLECTION.DISTANCE,
        on_disk_payload: DEFAULTS.COLLECTION.ON_DISK_PAYLOAD,
        data_type: DEFAULTS.COLLECTION.DATA_TYPE,
      },

      relevantDistance: DEFAULTS.RELEVANT_DISTANCE,
      relevantTop: DEFAULTS.RELEVANT_TOP,
      relevantSomeCount: DEFAULTS.RELEVANT_SOME_COUNT,

      chunkSize: DEFAULTS.CHUNK_SIZE,
      batchSize: DEFAULTS.BATCH_SIZE,

      bluebird_concurrency: DEFAULTS.BLUEBIRD_CONCURRENCY,
    };
    logger.debug(`Defaults: ${defaultValues}`);
    return defaultValues;
  }

  async createCollection(collection: string) {
    logger.defaultMeta = { Procedure: "createCollection" };
    logger.info("Creating a new collection...");
    try {
      const result = await this._client.createCollection(`${collection}`, {
        vectors: {
          size: this._default.collection.size,
          distance: this._default.collection.distance,
          on_disk_payload: this._default.collection.on_disk_payload,
          data_type: "float32",
        },
      });
      logger.debug(`Result: ${result}`);
      return result;
    } catch (error) {
      logger.error(`Error creating collection: ${error}`);
      return null;
    }
  }

  async dropCollection(collection: string) {
    logger.defaultMeta = { Procedure: "dropCollection" };
    logger.info("Dropping collection...");
    try {
      const result = await this._client.deleteCollection(`${collection}`);
      logger.debug(`Result: ${result}`);
      return result;
    } catch (error) {
      logger.error(`Error dropping collection: ${error}`);
      return null;
    }
  }

  async getCollection(collection: string) {
    logger.defaultMeta = { Procedure: "getCollection" };
    logger.info("Getting collection...");
    try {
      const result = await this._client.getCollection(`${collection}`);
      logger.debug(`Result: ${result}`);
      return result;
    } catch (error) {
      logger.error(`Error getting collection: ${error}`);
      return null;
    }
  }

  // toChunks(
  //   document: Float32Array,
  //   chunkSize: number = this._default.chunkSize
  // ) {
  //   logger.defaultMeta = { Procedure: "toChunks" };
  //   logger.info("Creating chunks...");
  //   const chunks: Array<Float32Array> = [];
  //   for (let i = 0; i < document.length; i += chunkSize) {
  //     chunks.push(document.slice(i, i + chunkSize));
  //   }
  //   logger.debug(`Chunks: ${chunks}`);
  //   return chunks;
  // }

  async addDocument(collection: string, embedding: Float32Array, _id: string, publishedAt: Date) {
    logger.defaultMeta = { Procedure: "addDocument" };
    logger.info("Adding document...");
    logger.debug(`embedding length: ${embedding.length}`)
    try {
      const id = uuidv4();
      const payload = {
        id: _id,
        publishedAt: new Date(publishedAt).getTime(), // should be numeric
      }

      const body = {
        "points": [
          {
            "id": id,
            "payload": payload,
            "vector": Object.values(embedding),
          },
        ],
      }
      const result = await this._client.upsert(`${collection}`, body);
      logger.debug(`Result: ${result}`);
      return result;
    } catch (error) {
      logger.error(`Error adding document: ${error}`);
      return null;
    }
  }

  // async addDocument(collection: string, document: Float32Array, _id: string) {
  //   logger.defaultMeta = { Procedure: "addDocument" };
  //   logger.info("Adding document...");
  //   try {
  //     const chunks = this.toChunks(document);
  //     const results = await bluebird.map(
  //       chunks,
  //       async (chunk) => {
  //         await axios.post(
  //           `${this._url}/collections/${collection}/points/add`,
  //           {
  //             vector: chunk,
  //             id: _id,
  //           }
  //         );
  //       },
  //       { concurrency: this._default.bluebird_concurrency }
  //     );
  //     logger.debug(`Result: ${results}`);
  //     return results;
  //   } catch (error) {
  //     logger.error(`Error adding document: ${error}`);
  //     return null;
  //   }
  // }

  //   async addDocuments(
  //     collection: string,
  //     documents: Array<Float32Array>,
  //     batchSize: number = this._default.batchSize
  //   ) {
  //     logger.defaultMeta = { Procedure: "addDocuments" };
  //     logger.info("Adding documents...");
  //     try {
  //       const batches = Array(Math.ceil(documents.length / batchSize))
  //         .fill([])
  //         .map((_, index) => {
  //           return documents.slice(index * batchSize, (index + 1) * batchSize);
  //         });
  //       logger.debug(`Batch length: ${batches.length}`);
  //       const results = await bluebird.map(
  //         batches,
  //         async (items, index) => {
  //           await this.addDocument(collection, items[index]);
  //         },
  //         { concurrency: this._default.bluebird_concurrency }
  //       );
  //       logger.debug(`Results: ${results}`);
  //       return results;
  //     } catch (error) {
  //       logger.error(`Error adding documents: ${error}`);
  //       return null;
  //     }
  //   }

  // private async findRelevantChunk(
  //   collection: string,
  //   chunk: Float32Array,
  //   top: number = this._default.relevantTop
  // ) {
  //   logger.defaultMeta = { Procedure: "findRelevantChunk" };
  //   logger.info("Finding relevant chunk...");
  //   try {
  //     const result = await axios.post(
  //       `${this._url}/collections/${collection}/points/search`,
  //       {
  //         vector: chunk,
  //         top,
  //       }
  //     );
  //     logger.debug(`Result: ${result}`);
  //     return result;
  //   } catch (error) {
  //     logger.error(`Error finding relevant chunk: ${error}`);
  //     return null;
  //   }
  // }

  private dailyRange() {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    return [yesterday.getTime(), today.getTime()]
  }

  private weeklyRange() {
    const today = new Date();
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    return [lastWeek.getTime(), today.getTime()];
  }

  private monthlyRange() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return [lastMonth.getTime(), today.getTime()];
  }

  private getRange(frequency: 'daily' | 'weekly' | 'monthly') {
    switch (frequency) {
      case 'daily':
        return this.dailyRange();
      case 'weekly':
        return this.weeklyRange();
      case 'monthly':
        return this.monthlyRange();
    }
  }

  async findRelevantDocuments(
    collection: string,
    query: Float32Array,
    top: number = this._default.relevantTop,
    frequency: 'daily' | 'weekly' | 'monthly' = 'daily'
  ) {
    logger.defaultMeta = { Procedure: "findRelevantQuerys" };
    logger.info("Finding relevant querys...");
    try {
      const result = this._client.search(`${collection}`, {
        vector: query,
        filter: {
          should: {
            "key": "publishedAt",
            "range": {
              "gte": this.getRange(frequency)[0],
              "lt": this.getRange(frequency)[1]
            }
          }
        },
        limit: top,
      });
      logger.debug(`Result: ${result}`);
      return result;
    } catch (error) {
      logger.error(`Error finding relevant documents: ${error}`);
      return null;
    }
  }

  deleteOldNews(collection: string) {
    logger.defaultMeta = { Procedure: "deleteOldNews" };
    logger.info("Deleting old news...");
    try {
      const result = this._client.delete(`${collection}`, JSON.stringify({
        filter: {
          should: {
            "key": "publishedAt",
            "range": {
              "lt": +QDRANT_CONFIG.NEWS_EXPIRE
            }
          }
        }
      }));
      logger.debug(`Result: ${result}`);
      return result;
    } catch (error) {
      logger.error(`Error deleting old news: ${error}`);
      return null;
    }
  }


  //   async findSomeRelevantDocuments(
  //     collection: string,
  //     queries: Array<Float32Array>,
  //     top: number = this._default.relevantTop,
  //     distance: number = this._default.relevantDistance
  //   ) {
  //     logger.defaultMeta = { Procedure: "findSomeRelevantDocuments" };
  //     logger.info(
  //       `Finding some relevant documents with distance[${distance}]...`
  //     );
  //     try {
  //         const results = await bluebird.some(queries.map(async query => {
  //             const result = await this.findRelevantDocuments(collection, query, top)
  //             if(result && result.distance <= distance) {

  //             }
  //         }), this._default.relevantSomeCount);
  //     } catch (error) {
  //       logger.error(`Error finding some relevant documents: ${error}`);
  //       return null;
  //     }
  //   }
}

export default QDrantController;
