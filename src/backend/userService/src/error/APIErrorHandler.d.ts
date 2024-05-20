import { NextFunction, Request, Response } from "express";

declare const APIErrorHandler: (APIHandler: Function) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

export default APIErrorHandler;