import DatabaseError from "../error/DatabaseError";
import logger from "../config/logger";
import NotFoundError from "../error/NotFoundError";
import UserModel, { UserType } from "../model/user"
import AppCrypto from "../lib/auth/crypto";
import mongoose from "mongoose";

/**
 * Checks if a user exists in the database.
 * @async
 * @param {string} email - The email of the user.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the user exists.
 * @throws {NotFoundError} When the user does not exist.
 * @throws {DatabaseError} When the user information cannot be retrieved.
 */
const userIsExist = async (email: string): Promise<boolean> => {
    logger.defaultMeta = { ...logger.defaultMeta, procedure: "query/user/userIsExist"}
    try {
        logger.debug(`Checking if user ${email} exists...`)
        const result = await UserModel.exists({ email })
        logger.debug(`User ${email} exists: ${result}`)
        if(!result) throw new NotFoundError(`User ${email} not found`)
        return true;
    } catch (error) {
        logger.error(`Error checking if user ${email} exists: ${error}`)
        return Promise.reject(error instanceof NotFoundError ? error : new DatabaseError("Error checking if user exists"))
    }
}

/**
 * Gets user information from the database.
 * @async
 * @param {string} email - The email of the user.
 * @returns {Promise<User>} A promise that resolves to the user information.
 * @throws {NotFoundError} When the user does not exist.
 * @throws {DatabaseError} When the user information cannot be retrieved.
 */
const getUserInformation = async (email: string): Promise<UserType> => {
    logger.defaultMeta = { ...logger.defaultMeta, procedure: "query/user/getUserInformation"}
    try {
        logger.debug(`Getting user information for ${email}...`)
        const result = await UserModel.findOne({ email });
        logger.debug(`User information query for ${email} finished successfully`)
        if(!result) throw new NotFoundError(`User ${email} not found`)
        logger.info(`User information for ${email} retrieved successfully`)
        return result;
    } catch (error) {
        logger.error(`Error getting user information: ${error}`)
        return Promise.reject(error instanceof NotFoundError ? error : new DatabaseError("Error getting user information"))
    }
}

/**
 * Adds a new user to the database.
 * @async
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {string} frequency - The frequency of the user.
 * @param {string} prompt - The prompt of the user.
 * @returns {Promise<User>} A promise that resolves to the new user.
 * @throws {DatabaseError} When the user cannot be added to the database.
 * @throws {Error} When the password cannot be hashed.
 */
const addNewUser = async (email: string, password: string, frequency: string, prompt: string): Promise<UserType> => {
    logger.defaultMeta = { ...logger.defaultMeta, procedure: "query/user/addNewUser"}
    try {
        logger.debug(`Adding new user ${email}...`)
        const newUser = await new UserModel({
            email,
            password: await AppCrypto.hashPassword(password),
            frequency,
            prompt
        }).save();
        logger.debug(`New user ${email} added successfully`)
        return newUser;
    } catch (error) {
        logger.error(`Error adding new user ${email}: ${error}`)
        return Promise.reject(new DatabaseError("Error adding new user"))
    }
}

/**
 * Updates the subscription of a user.
 * @async
 * @param {string} email - The email of the user.
 * @param {string} frequency - The frequency of the user.
 * @param {string} prompt - The prompt of the user.
 * @returns {Promise<UpdateWriteOpResult>} A promise that resolves to the result of the update operation.
 * @throws {DatabaseError} When the subscription cannot be updated.
 */
const updateSubscription = async (email: string, frequency: 'daily' | 'weekly' | 'monthly', prompt: string): Promise<mongoose.UpdateWriteOpResult> => {
    logger.defaultMeta = { ...logger.defaultMeta, procedure: "query/user/updateSubscription"}
    try {
        logger.debug(`Updating subscription for ${email}...`)
        const result = await UserModel.updateOne({ email }, { frequency, prompt })
        logger.debug(`Subscription for ${email} updated successfully`)
        return result;
    } catch (error) {
        logger.error(`Error updating subscription for ${email}: ${error}`)
        return Promise.reject(new DatabaseError("Error updating subscription"))
    }
}

export {
    getUserInformation,
    userIsExist,
    addNewUser,
    updateSubscription
}