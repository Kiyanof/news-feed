import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import Tokenizer, { Payload } from "../lib/auth/tokenizer";
import UserModel from "../model/user";
import { setTokenCookie } from "../utils/user";
import { createWhitelist } from "../utils/whitelist";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenizer = Tokenizer.new();
    logger.debug(`Tokenizer: ${tokenizer}`);
    const whitelist = await createWhitelist(tokenizer);
    logger.debug(`Whitelist: ${whitelist}`);
    await whitelist.init();
    logger.debug(`Whitelist initialized`);

    logger.debug(`Access token: ${req.cookies.access_token}`);
    logger.debug(`Refresh token: ${req.cookies.refresh_token}`);
    const payload = await tokenizer.verify(
      req.cookies.access_token,
      req.cookies.refresh_token
    );
    if (!payload) {
      return res.status(401).json({
        message: "Unauthorized",
        error: ["token"],
        data: null,
      });
    }

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

    const userInformation = await UserModel.findOne({ email: payload.email });
    if (!userInformation) {
      await whitelist.destroy();
      throw new Error("User not found!");
    }

    req.body.email = userInformation.email;
    await whitelist.destroy();
    return next();
  } catch (error) {
    logger.error(`Error: ${error}`);
    return res.status(401).json({
      message: "Unauthorized",
      error: ["token"],
      data: null,
    });
  }
};

export { authenticate };
