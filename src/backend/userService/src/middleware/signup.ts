import { NextFunction, Request, Response } from "express";
import UserModel from "../model/user";
import logger from "../config/logger";

const inputValidation = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Validating input fields');
    const {email, password, frequency, prompt, fingerPrint} = req.body;

    logger.debug(`Email: ${email}, Password: ${password}, Frequency: ${frequency}, Prompt: ${prompt}, FingerPrint: ${fingerPrint}`)
    if (!email || !password || !frequency || !prompt || !fingerPrint) {
        return res.status(400).json({
            message: 'Missing required fields',
            error: ['email' , 'password', 'frequency', 'prompt', 'fingerPrint'],
            data: null
        })
    }

    return next();
}

const isUserExist = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Checking if user already exist');
    const {email} = req.body;
    try {
        const isExist = await UserModel.exists({email})
        logger.debug(`User exist: ${isExist}`)
        if (isExist) {
            return res.status(400).json({
                message: 'User already exist',
                error: ['email'],
                data: null
            })
        }

        return next();
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            data: null
        })
    }    
}

export {
    inputValidation,
    isUserExist
}