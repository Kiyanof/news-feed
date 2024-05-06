import axios from "axios";

class QDrantController {
    /**
     * @param url - URL of the QDrant server
     * @private
     * @type {string}
     */
  private _url: string;

  /**
   * 
   * @param url - URL of the QDrant server
   * @constructor
   * @type {string}
   * @private
   */
  constructor(url: string) {
    this._url = url;
  }

  /**
   * 
   * @param collection  - The name of the collection
   * @param payload - The payload to be sent to the QDrant server
   * @private
   * @returns {Promise<void>}
   * @type {string}
   */
  private async createCollection(collection: string, payload: any) {
    // TODO: Change any to a more specific type & add return type
    await axios.post(`${this._url}/collections/${collection}`, payload);
  }

  /**
   * 
   * @param collection  - The name of the collection
   * @param payload  - The payload to be sent to the QDrant server
   * @private
   * @returns {Promise<void>}
   * @type {string}
   */
  private async addDocument(collection: string, payload: any) {
    // TODO: Change any to a more specific type & add return type
    await axios.post(`${this._url}/collections/${collection}/points`, payload);
  }

  /**
   * Chunk the array into smaller arrays
   */
  // private createChunks(array: number[], chunkSize: number) {
  //   const chunks = [];
  //   for (let i = 0; i < array.length; i += chunkSize) {
  //     chunks.push(array.slice(i, i + chunkSize));
  //   }
  //   return chunks;
  // }

  /**
   * @memberof QDrantController
   * @instance
   * @method
   * @name storeDocoument
   * @public
   * @async
   * @param collection  - The name of the collection
   * @param documentid  - The ID of the document
   * @param vector  - The vector to be stored
   * @returns {Promise<void>}
   * @type {string}
   */
  async storeDocoument(
    collection: string,
    documentid: string,
    vector: number[]
  ) {
    const payload = {
      create_collection: {
        vector_size: vector.length,
        distance: "DotProduct",
      },
    };
    await this.createCollection(collection, payload);

    const documentPayload = {
      upsert_points: {
        points: [
          {
            vector,
            id: documentid,
            payload: {},
          },
        ],
      },
    };
    await this.addDocument(collection, documentPayload);
  }

  async findRelevantDocuments(collection: string, vector: number[], top: number) {
    const response = await axios.post(`${this._url}/collections/${collection}/points/search`, {
      vector,
      top,
    });
    return response.data;
  }
  
  async dropCollection(collection: string) {
    const response = await axios.delete(`${this._url}/collections/${collection}`);
    return response.data;
  }
}

export default QDrantController;