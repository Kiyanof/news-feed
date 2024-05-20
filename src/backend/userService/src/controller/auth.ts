import { Request, Response } from "express";
import logger from "../config/logger";
import {
  checkPassword,
  setNewTokenCookie,
} from "../utils/user";
import Tokenizer from "../lib/auth/tokenizer";
import { createWhitelist } from "../utils/whitelist";
import addSubsciberToSubscriptionService from "../producer/addSubscriber";
import {
  addNewUser,
  getUserInformation,
  updateSubscription,
} from "../query/user";
import APIErrorHandler from "../error/APIErrorHandler";
import BrokerError from "../error/BrokerError";
import API_CONFIG from "../config/API.config";

/**
 * API function for getting user information.
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves to an Express response object.
 */
const whoIsMe = APIErrorHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const userInformation = await getUserInformation(email);

  res.status(API_CONFIG.HTTP_STATUS.OK).json({
    message: "Token verified",
    error: [],
    data: {
      email: userInformation.email,
      frequency: userInformation.frequency,
      prompt: userInformation.prompt,
    },
  });
});

/**
 * API function for signing up a new user.
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves to an Express response object.
 * @throws {BrokerError} When the user cannot be added to the subscription service.
 * @throws {DatabaseError} When the user cannot be added to the database.
 */
const signup = APIErrorHandler(async (req: Request, res: Response) => {
  const { email, password, frequency, prompt } = req.body;

  const isAdded = await addSubsciberToSubscriptionService(
    email,
    frequency,
    prompt
  );
  if (!isAdded)
    throw new BrokerError("Failed to add user to subscription service");

  const newUser = await addNewUser(email, password, frequency, prompt);

  return (await setNewTokenCookie(req, res)).status(API_CONFIG.HTTP_STATUS.CREATED).json({
    message: "User created successfully",
    error: null,
    data: {
      email: newUser.email,
      frequency: newUser.frequency,
      prompt: newUser.prompt,
    },
  });
});

/**
 * API function for logging in a user.
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves to an Express response object.
 * @throws {UnauthorizedError} When the password is incorrect.
 * @throws {DatabaseError} When the user cannot be retrieved from the database.
 */
const login = APIErrorHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserInformation(email);
  await checkPassword(password, user.password);
  (await setNewTokenCookie(req, res)).status(API_CONFIG.HTTP_STATUS.OK).json({
    message: "Login successful",
    error: null,
    data: {
      email: user.email,
      frequency: user.frequency,
      prompt: user.prompt,
    },
  });
});

/**
 * API function for logging out a user.
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves to an Express response object.
 */
const logout = APIErrorHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  logger.debug(`Email: ${email}`);

  const tokenizer = Tokenizer.new();
  const whitelist = await createWhitelist(tokenizer);
  await whitelist.init();

  tokenizer.logout(req.cookies.access_token, req.cookies.refresh_token);

  res.cookie("access_token", "", { maxAge: 0 });
  res.cookie("refresh_token", "", { maxAge: 0 });

  await whitelist.destroy();

  return res.status(API_CONFIG.HTTP_STATUS.OK).json({
    message: "Logout successful",
    error: null,
    data: null,
  });
});

/**
 * API function for changing a user's subscription settings.
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves to an Express response object.
 * @throws {BrokerError} When the user cannot be added to the subscription service.
 * @throws {DatabaseError} When the user's subscription cannot be updated in the database.
 */
const changeSubscription = APIErrorHandler(
  async (req: Request, res: Response) => {
    const { email, frequency, prompt } = req.body;

    const isChanged = await addSubsciberToSubscriptionService(
      email,
      frequency,
      prompt
    );
    if (!isChanged) {
      throw new BrokerError("Failed to change user subscription");
    }

    await updateSubscription(email, frequency, prompt);

    return res.status(API_CONFIG.HTTP_STATUS.OK).json({
      message: "User updated successfully",
      error: null,
      data: null,
    });
  }
);

export { signup, whoIsMe, login, logout, changeSubscription };
