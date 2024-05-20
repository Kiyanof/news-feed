import { body, validationResult } from 'express-validator';
import APIErrorHandler from '../error/APIErrorHandler';
import { NextFunction, Request, Response } from 'express';
import ValidationError from '../error/ValidationError';
import { userIsExist } from '../query/user';

/**
 * Middleware for checking if the user exists.
 * If the user does not exist, it throws a NotFoundError with a message.
 */
const isUserExist = APIErrorHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const { email } = req.body;
    await userIsExist(email) // Rise NotFoundError if user does not exist for APIErrorHandler to catch
    next()
})

/**
 * Middleware for validating the signup request.
 * It checks if the email, password, and fingerprint are valid.
 * If there are any validation errors, it throws a ValidationError with a message containing all the error messages.
 */
const signupValidation = [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('frequency').isIn(['daily', 'weekly', 'monthly']).withMessage('Frequency must be daily, weekly, or monthly'),
    body('prompt').isString().withMessage('Prompt must be a string'),
    body('fingerPrint').isString().withMessage('Fingerprint must be a string'),
    /**
     * Error handling middleware.
     * @param {Request} req - The request object.
     * @param {Response} _res - The response object.
     * @param {NextFunction} next - The next middleware function.
     */
    APIErrorHandler(async (req: Request, _res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) throw new ValidationError(errors.array().map((error) => error.msg).join(', '))
        next();
    })
]

/**
 * Middleware for validating the signin request.
 * It checks if the email, password, and fingerprint are valid.
 * If there are any validation errors, it throws a ValidationError with a message containing all the error messages.
 */
const signinValidation = [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isString().withMessage('Password must be a string'),
    body('fingerPrint').isString().withMessage('Fingerprint must be a string'),
    /**
     * Error handling middleware.
     * @param {Request} req - The request object.
     * @param {Response} _res - The response object.
     * @param {NextFunction} next - The next middleware function.
     */
    APIErrorHandler(async (req: Request, _res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) throw new ValidationError(errors.array().map((error) => error.msg).join(', '))
        next();
    })
]

/**
 * Middleware for validating the change subscription request.
 * It checks if the email, frequency, prompt, and fingerprint are valid.
 * If there are any validation errors, it throws a ValidationError with a message containing all the error messages.
 */
const changeSubscriptionValidation = [
    body('email').isEmail().withMessage('Email is not valid'),
    body('frequency').isIn(['daily', 'weekly', 'monthly']).withMessage('Frequency must be daily, weekly, or monthly'),
    body('prompt').isString().withMessage('Prompt must be a string'),
    body('fingerPrint').isString().withMessage('Fingerprint must be a string'),
    /**
     * Error handling middleware.
     * @param {Request} req - The request object.
     * @param {Response} _res - The response object.
     * @param {NextFunction} next - The next middleware function.
     */
    APIErrorHandler(async (req: Request, _res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) throw new ValidationError(errors.array().map((error) => error.msg).join(', '))
        next();
    })
]

export {
    signupValidation,
    signinValidation,
    changeSubscriptionValidation,
    isUserExist
}