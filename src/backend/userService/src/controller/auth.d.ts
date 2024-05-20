import { Request, Response } from "express";
import { Document } from "mongoose";

declare function whoIsMe(req: Request, res: Response): Promise<void>;
declare function signup(req: Request, res: Response): Promise<void>;
declare function login(req: Request, res: Response): Promise<void>;
declare function logout(req: Request, res: Response): Promise<void>;
declare function changeSubscription(req: Request, res: Response): Promise<void>;

export { whoIsMe, signup, login, logout, changeSubscription};
