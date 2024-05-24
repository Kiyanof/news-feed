import { NextFunction, Request, Response } from "express";
import NotFoundError from "./NotFoundError";
import ValidationError from "./ValidationError";
import BrokerError from "./BrokerError";
import logger from "../config/logger";
import DatabaseError from "./DatabaseError";
import UnauthorizedError from "./UnauthorizedError";
import API_CONFIG from "../config/API.config";

/**
 * Error handling middleware for API routes.
 * @param {Function} APIHandler - The API controller function to wrap.
 * @returns {Function} A new function that wraps the APIHandler function in a try-catch block.
 */
const APIErrorHandler = (
  APIHandler: Function
): ((req: Request, res: Response, next: NextFunction) => void) => {
  /**
   * @async
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The next middleware function.
   */
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await APIHandler(req, res, next);
    } catch (error) {
      logger.error(`API error: ${error.message}`);
      if (error instanceof NotFoundError) {
        res.status(API_CONFIG.HTTP_STATUS.NOT_FOUND).json({
          message: "Not found",
          error: [error.message],
          data: null,
        });
      } else if (error instanceof ValidationError) {
        res.status(API_CONFIG.HTTP_STATUS.BAD_REQUEST).json({
          message: "Validation error",
          error: [error.message],
          data: null,
        });
      } else if (error instanceof BrokerError) {
        res.status(API_CONFIG.HTTP_STATUS.SERVICE_UNAVAILABLE).json({
          message: "Broker error",
          error: [error.message],
          data: null,
        });
      } else if (error instanceof DatabaseError) {
        res.status(API_CONFIG.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          message: "Database error",
          error: [error.message],
          data: null,
        });
      } else if (error instanceof UnauthorizedError) {
        res.status(API_CONFIG.HTTP_STATUS.UNAUTHORIZED).json({
          message: "Unauthorized",
          error: [error.message],
          data: null,
        });
      } else {
        res.status(API_CONFIG.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          message: "Internal server error",
          error: [error.message],
          data: null,
        });
        next(error);
      }
    }
  };
};

export default APIErrorHandler;
