import Tokenizer, { IWhiteList } from "../auth/tokenizer";
import logger from "../../config/logger";
import { Redis } from "ioredis";

/**
 * Whitelist class for managing tokens.
 */
class Whitelist {

  /**
   * Whitelist constructor.
   * @param {Tokenizer} _tokenizer - The tokenizer instance.
   * @param {Redis} _client - The Redis client instance.
   */
  constructor(
    private readonly _tokenizer: Tokenizer,
    private readonly _client: Redis
  ) {
    logger.defaultMeta.service = "whitelist";
  }

  /**
   * Initializes the Whitelist service.
   */
  public async init() {
    try {

      this._tokenizer.events.on(
        "addToken",
        async (document: IWhiteList, response: (result: boolean) => void) => {
          logger.debug("Event: Adding token to whitelist");
          const result = await this.add(document);
          response(result);
        }
      );

      this._tokenizer.events.on(
        "removeToken",
        async (jwtid: string, response: (result: boolean) => void) => {
          logger.debug("Event: Removing token from whitelist");
          response(await this.remove(jwtid));
        }
      );

      this._tokenizer.events.on(
        "hasToken",
        async (jwtid: string, response: (result: boolean) => void) => {
          logger.debug("Event: Checking if token is in whitelist");
          response(await this.has(jwtid));
        }
      );
    } catch (error) {
      logger.error(`Error initializing whitelist service: ${error}`);
    }
  }

  /**
   * Converts a Date object to seconds.
   * @param {Date} date - The date to convert.
   * @returns {number} The date in seconds.
   */
  private dateToSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  /**
   * Calculates the TTL (Time To Live) for a token.
   * @param {Date} date - The expiration date of the token.
   * @returns {number} The TTL in seconds.
   */
  private calculateTTL(date: Date): number {
    const now = Math.floor(Date.now() / 1000);
    return this.dateToSeconds(date) - now;
  }

  /**
   * Sets the TTL for a token.
   * @param {string} jwtid - The JWT ID of the token.
   * @param {number} ttl - The TTL to set.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  private async setTTL(jwtid: string, ttl: number): Promise<boolean> {
    try {
      const response = await this._client.expire(jwtid, ttl);
      logger.debug(`Token ${jwtid} TTL set: ${!!response && response > 0}`);
      return true;
    } catch (error) {
      logger.error(`Error setting token TTL: ${error}`);
      return false;
    }
  }

  /**
   * Adds a token to the whitelist.
   * @param {IWhiteList} document - The token document to add.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  private async add(document: IWhiteList): Promise<boolean> {
    logger.debug("Adding token to whitelist");
    try {
      const key = `${document.type}:${document.jwtid}`
      const response = await this._client.set(
        key,
        JSON.stringify(document)
      );
      await this.setTTL(key, this.calculateTTL(document.expireAt));
      logger.debug(
        `Token ${document.jwtid} added to whitelist: ${response === "OK"}`
      );
      return true;
    } catch (error) {
      logger.error(`Error adding token to whitelist: ${error}`);
      return false;
    }
  }

  /**
   * Removes a token from the whitelist.
   * @param {string} jwtid - The JWT ID of the token to remove.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  private async remove(jwtid: string): Promise<boolean> {
    try {
      const response = await this._client.del(`${jwtid}`);
      logger.debug(`Token ${jwtid} removed from whitelist: ${!!response && response > 0}`);
      return true;
    } catch (error) {
      logger.error(`Error removing token from whitelist: ${error}`);
      return false;
    }
  }

  /**
   * Checks if a token is in the whitelist.
   * @param {string} jwtid - The JWT ID of the token to check.
   * @returns {Promise<boolean>} True if the token is in the whitelist, false otherwise.
   */
  private async has(jwtid: string): Promise<boolean> {
    try {
      const response = await this._client.exists(`${jwtid}`);
      logger.debug(`Token ${jwtid} is in whitelist: ${!!response && response > 0}`);
      return !!response && response > 0;
    } catch (error) {
      logger.error(`Error checking if token is in whitelist: ${error}`);
      return false;
    }
  }

  /**
   * Destroys the Whitelist service.
   */
  async destroy() {
    logger.debug("Destroying whitelist service...");
    this._tokenizer.events.removeAllListeners('addToken');
    this._tokenizer.events.removeAllListeners('removeToken');
    this._tokenizer.events.removeAllListeners('hasToken');
    logger.info("Whitelist service destroyed");
  }
}

export default Whitelist;
