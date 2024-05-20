import { decode, sign, verify, Algorithm, JwtPayload } from "jsonwebtoken";
import { EventEmitter } from "events";
import { v4 as uuid } from "uuid";
import TOKEN_CONFIG from "../../config/token.config";
import logger from "../../config/logger";

type TokenType = "ACCESS" | "REFRESH";

// enum TokenStatus {
//   valid,
//   Expired,
//   Invalid,
// }


interface Claims {
  expiresIn: string;
  issuer: string;
  audience: string;
  jwtid: string;
}

export interface Payload {
    email: string;
    ip: string;
    fingerPrint: string;
  }

export interface IWhiteList {
  email: string;
  jwtid: string;
  expireAt: Date;
  issuedAt: Date;
  type: TokenType;
}

export interface signResult {
  accessToken: string | null;
  refreshToken: string | null;
}

/**
 * Tokenizer class
 * @class
 * @classdesc Tokenizer class for token generation and verification
 * @singleton
 * @property {EventEmitter} _events - Event emitter for token events
 * @property {string} _secret - Secret key for token generation
 * @property {string} _expiresIn - Expiry time for token
 * @property {Algorithm} _algorithm - Algorithm for token generation
 * @method {addTokenToWhiteList} - Add token to white list
 * @method {removeTokenFromWhiteList} - Remove token from white list
 * @method {checkTokenInWhiteList} - Check if token is in white list
 * @method {sign} - Sign token
 * @method {verifyToken} - Verify token
 * @method {verifyTokenWithWhiteList} - Verify token with white list
 * @method {getPayload} - Get payload from token
 * @method {verifyTokenAndGetPayload} - Verify token and get payload
 * @static
 * @returns {Tokenizer} Tokenizer instance
 */
class Tokenizer {
  private static _instance: Tokenizer;
  private _events: EventEmitter;

  public static new(): Tokenizer {
    logger.defaultMeta = { class: "Tokenizer" }
    logger.info(`Creating new Tokenizer instance`)
    if (!this._instance) this._instance = new Tokenizer();
    return this._instance;
  }

  private constructor(
  ) {
    logger.info(`Creating new Tokenizer instance`)

    this._events = new EventEmitter();
    logger.debug(`Event emitter created`)
  }

  public get events() {
    return this._events;
  }

  private addTokenToWhiteList(document: IWhiteList): Promise<boolean> {
    logger.debug(`Adding token to white list`)
    return new Promise((resolve, _reject) => {
      this.events.emit("addToken", document, (result: boolean) => {
        logger.debug(`Document: JSON.stringify(document)`)
        logger.debug(`Token added to white list: ${result}`)
        resolve(result);
      });
    });
  }

  private removeTokenFromWhiteList(jwtid: string): Promise<boolean> {
    logger.debug(`Removing token from white list`)
    return new Promise((resolve, _reject) => {
      this.events.emit("removeToken", jwtid, (result: boolean) => {
        logger.debug(`JWTID: ${jwtid}`)
        logger.debug(`Token removed from white list: ${result}`)
        resolve(result);
      });
    });
  }

  private checkTokenInWhiteList(jwtid: string): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      this.events.emit("hasToken", jwtid, (result: boolean) => {
        logger.debug(`JWTID: ${jwtid}`)
        logger.debug(`Checking token in white list: ${result}`)
        resolve(result);
      });
    });
  }

  private checkUserInWhiteList(email: string): Promise<IWhiteList> {
    logger.debug(`Checking user in white list`)
    return new Promise((resolve, reject) => {
      try {
        this.events.emit("hasToken", email, (result: IWhiteList) => {
          logger.debug(`Email: ${email}`)
          resolve(result);
        });
      } catch (error) {
        logger.error(`Error checking user in white list: ${error}`)
        reject(null);
      }
    });
  }

  private expireTime(time: string) {
    logger.debug(`Calculating expiry time`)
    if (time.endsWith("h"))
      return parseInt(time.split("h")[0]) * 60 * 60 * 1000;

    if (time.endsWith("d"))
      return parseInt(time.split("d")[0]) * 24 * 60 * 60 * 1000;

    return parseInt(time) * 24 * 60 * 60 * 1000;
  }

  private generateWhitelistObject(
    payload: Payload,
    claims: Claims,
    type: TokenType
  ): IWhiteList {
    logger.debug(`Generating white list object`)
    return {
      email: payload.email,
      jwtid: claims.jwtid,
      expireAt: new Date(Date.now() + this.expireTime(claims.expiresIn)),
      issuedAt: new Date(),
      type,
    };
  }

  private isExpired(expireAt: Date): boolean {
    logger.debug(`Checking if token is expired`)
    return expireAt.getTime() < Date.now();
  }

  private async signAccess({
    payload,
    claims,
    secret,
    algorithm,
    extendedPayload,
  }: {
    payload: Payload;
    claims: Claims;
    secret: string;
    algorithm: Algorithm;
    extendedPayload?: any;
  }): Promise<string | null> {
    logger.debug(`Signing access token`)
    try {
      logger.debug(`Checking if user is in white list`)
      const hasToken = await this.checkUserInWhiteList(payload.email);
      logger.debug(`User in white list: ${hasToken}`)
      if (hasToken && !this.isExpired(hasToken.expireAt)) return null;
      logger.info(`Signing access token`)
      const token = sign({ ...payload, ...extendedPayload }, secret, {
        ...claims,
        algorithm: algorithm,
      });
      logger.debug(`token signed successfully`)
      logger.debug(`Adding token to white list`)
      await this.addTokenToWhiteList(
        this.generateWhitelistObject(payload, claims, "ACCESS")
      );
      logger.debug(`Token added to white list`)
      return token;
    } catch (error) {
      logger.error(`Error signing access token: ${error}`)
      return null;
    }
  }

  /**
   * Signs a refresh token.
   * @param {Payload} payload - The payload to sign.
   * @param {Claims} claims - The claims to sign.
   * @param {string} secret - The secret key to sign with.
   * @param {Algorithm} algorithm - The algorithm to sign with.
   * @returns {string | null} The signed token or null if an error occurred.
   * @async
   * @private
   * @method
   * @memberof Tokenizer
   */
  private async signRefresh({
    payload,
    claims,
    secret,
    algorithm,
  }: {
    payload: Payload;
    claims: Claims;
    secret: string;
    algorithm: Algorithm;
  }): Promise<string | null> {
    logger.debug(`Signing refresh token`)
    try {
      const hasToken = await this.checkUserInWhiteList(payload.email);
      if (hasToken && !this.isExpired(hasToken.expireAt)) return null;
      logger.info(`Signing refresh token`)
      const token = sign(payload, secret, {
        ...claims,
        algorithm: algorithm,
      });
      logger.debug(`Token signed successfully`)
      await this.addTokenToWhiteList(
        this.generateWhitelistObject(payload, claims, "REFRESH")
      );
      logger.debug(`Token added to white list`)
      return token;
    } catch (error) {
      logger.error(`Error signing refresh token: ${error}`)
      return null;
    }
  }

  public async signToken({
    payload,
    claims,
    extendedPayload,
  }: {
    payload: Payload;
    claims: Claims;
    type: TokenType;
    extendedPayload?: any;
  }): Promise<signResult> {
    try {
      logger.info(`Signing token`)
    const jwtid = claims.jwtid === "" ? uuid() : claims.jwtid;
    logger.debug(`JWTID: ${jwtid}`)
    logger.debug(`access token generating...`)
    const accessToken = await this.signAccess({
      payload,
      claims: {
        ...claims,
        jwtid,
        expiresIn: TOKEN_CONFIG.ACCESS_TOKEN.EXPIRES_IN,
      },
      secret: TOKEN_CONFIG.ACCESS_TOKEN.SECRET,
      algorithm: TOKEN_CONFIG.ACCESS_TOKEN.ALGORITHM as Algorithm,
      extendedPayload,
    });
    logger.debug(`access token generated`)
    logger.debug(`refresh token generating...`)
    const refreshToken = await this.signRefresh({
      payload,
      claims: {
        ...claims,
        jwtid,
        expiresIn: TOKEN_CONFIG.REFRESH_TOKEN.EXPIRES_IN,
      },
      secret: TOKEN_CONFIG.REFRESH_TOKEN.SECRET,
      algorithm: TOKEN_CONFIG.REFRESH_TOKEN.ALGORITHM as Algorithm,
    });
    logger.debug(`refresh token generated`)
    return {
      accessToken,
      refreshToken,
    };
    } catch (error) {
      logger.error(`Error signing token: ${error}`)
      return {
        accessToken: null,
        refreshToken: null,
      };
    }
  }

  private verifyToken(token: string, secret: string, algorithm: Algorithm): string | JwtPayload | null{
    logger.debug(`Verifying token...`)
    try {
      let result: string | JwtPayload | null = null;

      result = verify(
        token,
        secret,
        { algorithms: [algorithm] },
      );
      logger.debug(`Token verified`)
      return result;
    } catch (error) {
      logger.error(`Error verifying token: ${error}`)
      return null;
    }
  }

  private async verifyTokenWithWhiteList(token: string, type: TokenType): Promise<boolean> {
    logger.debug(`Verifying token with white list...`)
    const jwtid = decode(token, { json: true })?.jti;
    logger.debug(`JWTID: ${jwtid}`)
    return await this.checkTokenInWhiteList(`${type}:${jwtid}` ?? '');
  }

  private async verifyTokenAndGetPayload(
    token: string,
    type: TokenType
  ): Promise<Payload | null> {
    logger.debug(`Verifying token and getting payload...`)
    try {
      logger.debug(`Verifying token...`)
      const isVerified = this.verifyToken(token,
        type === "ACCESS"
          ? TOKEN_CONFIG.ACCESS_TOKEN.SECRET
          : TOKEN_CONFIG.REFRESH_TOKEN.SECRET,
        type === "ACCESS"
          ? TOKEN_CONFIG.ACCESS_TOKEN.ALGORITHM as Algorithm
          : TOKEN_CONFIG.REFRESH_TOKEN.ALGORITHM as Algorithm
      );
      logger.debug(`Token verified: ${isVerified}`)
      if (!isVerified) {
        logger.warn(`Token not verified`)
        return null;
      }
      logger.debug(`Verifying token with white list...`)
      const isWhiteListed = await this.verifyTokenWithWhiteList(token, type);
      logger.debug(`Token verified with white list: ${isWhiteListed}`)
      if (!isWhiteListed) {
        logger.warn(`Token not verified with white list`)
        return null;
      }
      logger.debug(`Token verified and payload returned`)
      return isVerified as Payload;
    } catch (error) {
      logger.error(`Error verifying token and getting payload: ${error}`)
      return null;
    }
  }

  public async verify(accessToken: string, refreshToken: string): Promise<Payload | signResult | null> { //TODO: Fix this return
    logger.info(`Verifying token`)
    const accessTokenPayload = await this.verifyTokenAndGetPayload(accessToken, 'ACCESS');
    logger.debug(`Access token payload: ${accessTokenPayload}`)
    if (accessTokenPayload) return accessTokenPayload;
    const refreshTokenPayload = await this.verifyTokenAndGetPayload(
      refreshToken, 'REFRESH'
    );
    logger.debug(`Refresh token payload: ${refreshTokenPayload}`)
    if (refreshTokenPayload) {
      const { email, ip, fingerPrint } = refreshTokenPayload;

      const payload = { email, ip, fingerPrint };
      const claims = {
        expiresIn: TOKEN_CONFIG.ACCESS_TOKEN.EXPIRES_IN,
        issuer: "auth",
        audience: "user",
        jwtid: uuid(),
      };
      logger.debug(`Signing token...`)
      return await this.signToken({ payload, claims, type: "ACCESS" });
    }
    logger.warn(`Token not verified`)
    return null;
  }

  public async logout(accessToken: string, refreshToken: string): Promise<boolean> {
    logger.info(`Logging out...`)
    try {
      const accessTokenPayload = await this.verifyTokenAndGetPayload(accessToken, 'ACCESS');
      logger.debug(`Access token payload: ${accessTokenPayload}`)
      if (accessTokenPayload) {
          const jwtid = decode(accessToken, { json: true })?.jti;
          this.removeTokenFromWhiteList(`ACCESS:${jwtid}` ?? '')
      }
      const refreshTokenPayload = await this.verifyTokenAndGetPayload(refreshToken, 'REFRESH')
      logger.debug(`Refresh token payload: ${refreshTokenPayload}`)
      if (refreshTokenPayload) {
          const jwtid = decode(refreshToken, {json: true})?.jti
          this.removeTokenFromWhiteList(`REFRESH:${jwtid}` ?? '')
      }
      return true;
    } catch (error) {
      logger.error(`Error logging out: ${error}`)
      return false
    }
  }
}

export default Tokenizer;
