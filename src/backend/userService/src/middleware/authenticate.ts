/**
 * Module dependencies.
 */
import { NextFunction, Request, Response } from "express";
import Tokenizer, { Payload } from "../lib/auth/tokenizer";
import UserModel from "../model/user";
import { setTokenCookie } from "../utils/user";
import { createWhitelist } from "../utils/whitelist";
import UnauthorizedError from "../error/UnauthorizedError";
import { getUserInformation } from "../query/user";
import APIErrorHandler from "../error/APIErrorHandler";

/**
 * Middleware function to authenticate a user.
 * 
 * This function uses the APIErrorHandler to handle any errors that may occur during the authentication process.
 * It creates a new instance of the Tokenizer and a whitelist using the tokenizer.
 * The whitelist is then initialized and the access and refresh tokens from the request cookies are verified.
 * 
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 */
const authenticate = APIErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tokenizer = Tokenizer.new();
    const whitelist = await createWhitelist(tokenizer);
    await whitelist.init();

    const payload = await tokenizer.verify(
      req.cookies.access_token,
      req.cookies.refresh_token
    );

    if (!payload) throw new UnauthorizedError("Invalid token!");

    if ("accessToken" in payload && "refreshToken" in payload) {
      const { accessToken, refreshToken } = payload;
      res = setTokenCookie(res, payload);

      if (!accessToken || !refreshToken) {
        await whitelist.destroy();
        throw new Error("Invalid token generated!");
      }

      const payloadDate = (await tokenizer.verify(
        accessToken,
        refreshToken
      )) as Payload;
      if (!payloadDate) {
        await whitelist.destroy();
        throw new Error("Invalid token generated verification!");
      }

      const userInformation = await UserModel.findOne({
        email: payloadDate.email,
      });
      if (!userInformation) {
        await whitelist.destroy();
        throw new Error("User not found!");
      }

      req.body.email = userInformation.email;
      await whitelist.destroy();
      return next();
    }

    const userInformation = await getUserInformation(payload.email);

    req.body.email = userInformation.email;
    await whitelist.destroy();
    return next();
  }
);

export { authenticate };
