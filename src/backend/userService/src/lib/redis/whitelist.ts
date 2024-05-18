import Tokenizer, { IWhiteList } from "../auth/tokenizer";
import logger from "../../config/logger";
import { Redis } from "ioredis";

class Whitelist {

  constructor(
    private readonly _tokenizer: Tokenizer,
    private readonly _client: Redis
  ) {
    logger.defaultMeta.service = "whitelist";
  }

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

  private dateToSeconds(date: Date) {
    return Math.floor(date.getTime() / 1000);
  }

  private calculateTTL(date: Date) {
    const now = Math.floor(Date.now() / 1000);
    return this.dateToSeconds(date) - now;
  }

  private async setTTL(jwtid: string, ttl: number) {
    try {
      const response = await this._client.expire(jwtid, ttl);
      logger.debug(`Token ${jwtid} TTL set: ${!!response && response > 0}`);
      return true;
    } catch (error) {
      logger.error(`Error setting token TTL: ${error}`);
      return false;
    }
  }

  private async add(document: IWhiteList) {
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

  private async remove(jwtid: string) {
    try {
      const response = await this._client.del(`${jwtid}`);
      logger.debug(`Token ${jwtid} removed from whitelist: ${!!response && response > 0}`);
      return true;
    } catch (error) {
      logger.error(`Error removing token from whitelist: ${error}`);
      return false;
    }
  }

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

  async destroy() {
    logger.debug("Destroying whitelist service...");
    this._tokenizer.events.off("addToken", this.add);
    this._tokenizer.events.off("removeToken", this.remove);
    this._tokenizer.events.off("hasToken", this.has);
    logger.info("Whitelist service destroyed");
  }
}

export default Whitelist;
