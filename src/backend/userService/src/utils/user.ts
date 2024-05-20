import {CookieOptions, Request, Response } from "express";
import Tokenizer, { signResult } from "../lib/auth/tokenizer";
import { createWhitelist } from "./whitelist";
import logger from "../config/logger";
import TOKEN_CONFIG from "../config/token.config";
import AppCrypto from "../lib/auth/crypto";
import UnauthorizedError from "../error/UnauthorizedError";
import APP_CONFIG from "../config/app.config";

const ENVIRONMENT = APP_CONFIG.ENVIRONMENT

/**
 * Sets the access and refresh tokens as cookies in the response.
 * @param {Response} res - The response object.
 * @param {signResult} token - The token object containing access and refresh tokens.
 * @returns {Response} The response object with the cookies set.
 */
const setTokenCookie = (res: Response, token: signResult) => {
    const secure = ENVIRONMENT === "production";
    const sameSite = ENVIRONMENT === "production" ? "none" : "lax";

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure,
        sameSite,
    }

    res.cookie('access_token', token.accessToken, cookieOptions)
    res.cookie('refresh_token', token.refreshToken, cookieOptions)

    return res;
}

/**
 * Creates a new token and sets it as a cookie in the response.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} The response object with the new token set as a cookie.
 */
const setNewTokenCookie = async (req: Request, res: Response) => {
    const { email, fingerPrint } = req.body;

    const tokenizer = Tokenizer.new();
    const whitelist = await createWhitelist(tokenizer);
    await whitelist.init();

    logger.debug(`Signing token...`);
    logger.debug(`tokenizer: ${tokenizer}`);
    const token = await tokenizer.signToken({
        payload: {
            email,
            fingerPrint,
            ip: req.ip ?? "",
        },
        claims: {
            expiresIn: TOKEN_CONFIG.ACCESS_TOKEN.EXPIRES_IN,
            audience: "user",
            issuer: "userService",
            jwtid: "",
        },
        type: "ACCESS",
    });
    logger.debug(`Token signed: ${token}`);

    const reponse = setTokenCookie(res, token);
    logger.debug(`Token cookie set: ${token}`);
    await whitelist.destroy();
    return reponse;
}

/**
 * Checks if the provided password matches the stored password.
 * @param {string} password - The provided password.
 * @param {string} toCheck - The stored password.
 * @throws {UnauthorizedError} If the passwords do not match.
 */
const checkPassword = async (password: string, toCheck: string) => {
    try {
        const result = await AppCrypto.comparePassword(password, toCheck);
        if(!result) throw new UnauthorizedError("Invalid password");
    } catch (error) {
        logger.error(`Error checking password: ${error}`);
        throw error;
    }
}
export {
    setTokenCookie,
    setNewTokenCookie,
    checkPassword
}