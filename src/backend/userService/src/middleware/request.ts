import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";

const logRequests = (req: Request, _res: Response, next: NextFunction) => {
    logger.debug(`Request: ${req.method} ${req.url}`);
    return next();
}

export {
    logRequests
}
