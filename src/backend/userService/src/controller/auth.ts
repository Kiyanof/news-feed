import { Request, Response } from "express";
import AppCrypto from "../lib/auth/crypto";
import logger from "../config/logger";
import TOKEN_CONFIG from "../config/token.config";
import UserModel from "../model/user";
import { setTokenCookie } from "../utils/user";
import Tokenizer from "../lib/auth/tokenizer";
import { createWhitelist } from "../utils/whitelist";
import addSubsciberToSubscriptionService from "../producer/addSubscriber";

/**
 * This controller handles the request to identify a user based on the email provided in the request body.
 * It queries the UserModel to find a user with the provided email.
 * If a user is found, it responds with a status of 200 and the user's information in JSON format.
 * If a user is not found, it throws an error.
 *
 * @async
 * @function
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} The Express response object.
 * @throws {Error} If the user is not found.
 */
const whoIsMe = async (req: Request, res: Response) => {

  const {email} = req.body

  try {

      const userInformation = await UserModel.findOne({email})
      if(!userInformation) {
        throw new Error("User not found!")
      }

      return res.status(200).json({
        message: "Token verified",
        error: null,
        data: {
          email: userInformation.email,
          frequency: userInformation.frequency,
          prompt: userInformation.prompt,
        },
      });
    }
    catch (error) {
      logger.error(`Error verifying token: ${error}`);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
}

/**
 * Signs up a new user.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const signup = async (req: Request, res: Response) => {
  const { email, password, frequency, prompt, fingerPrint } = req.body;

  try {
    /**
     * Adds a subscriber to the subscription service.
     * @param {string} email - The email of the subscriber.
     * @param {string} frequency - The frequency of the subscription.
     * @param {string} prompt - The prompt for the subscription.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful.
     */
    const isAdded = await addSubsciberToSubscriptionService(email, frequency, prompt)
    if(!isAdded) {throw new Error("Failed to add subscriber to subscription service")}
    
    logger.debug(`Hashing password...`)
    const hashedPassword = await AppCrypto.hashPassword(password);
    logger.debug(`Password hashed: ${hashedPassword}`)
    const newUser = await new UserModel({
      email,
      password: hashedPassword,
      frequency,
      prompt,
    }).save();
    logger.debug(`New user created: ${newUser}`)
    if (!newUser) {throw new Error("Failed to create user")}

    const tokenizer = Tokenizer.new()
    const whitelist = await createWhitelist(tokenizer)
    await whitelist.init()

    logger.debug(`Signing token...`)
    logger.debug(`tokenizer: ${tokenizer}`)
    const token = await tokenizer.signToken({
      payload: {
        email,
        fingerPrint,
        ip: req.ip ?? "",
      },
      claims: {
        expiresIn: TOKEN_CONFIG.ACCESS_TOKEN.EXPIRES_IN,
        audience: "user",
        issuer: "userService",
        jwtid: "",
      },
      type: "ACCESS",
    });
    logger.debug(`Token signed: ${token}`)

    const reponse = setTokenCookie(res, token);
    logger.debug(`Token cookie set: ${token}`)
    await whitelist.destroy()
    return reponse.status(201).json({
      message: "User created successfully",
      error: null,
      data: {
        email: newUser.email,
        frequency: newUser.frequency,
        prompt: newUser.prompt,
      },
    });
  } catch (error) {
    logger.error(`Error creating user: ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      data: null,
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password, fingerPrint } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: ["email"],
        data: null,
      });
    }

    const isPasswordValid = await AppCrypto.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
        error: ["password"],
        data: null,
      });
    }

    const tokenizer = Tokenizer.new()
    const whitelist = await createWhitelist(tokenizer)
    await whitelist.init()
    logger.debug(`Email: ${email}`)
    logger.debug(`Fingerprint: ${fingerPrint}`)
    logger.debug(`IP: ${req.ip ?? ""}`)
    const token = await tokenizer.signToken({
      payload: {
        email,
        fingerPrint,
        ip: req.ip ?? "",
      },
      claims: {
        expiresIn: TOKEN_CONFIG.ACCESS_TOKEN.EXPIRES_IN,
        audience: "user",
        issuer: "userService",
        jwtid: "",
      },
      type: "ACCESS",

    });
    await whitelist.destroy()
    const response = setTokenCookie(res, token);
    
    return response.status(200).json({
      message: "Login successful",
      error: null,
      data: {
        email: user.email,
        frequency: user.frequency,
        prompt: user.prompt,
      },
    });
  } catch (error) {
    logger.error(`Error logging in: ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      data: null,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    logger.debug(`Email: ${email}`)
    const user = await UserModel.findOne({ email });
    if (user) {
      const tokenizer = Tokenizer.new()
      const whitelist = await createWhitelist(tokenizer)
      await whitelist.init()

      tokenizer.logout(req.cookies.access_token, req.cookies.refresh_token);

      res.cookie("access_token", "", { maxAge: 0 });
      res.cookie("refresh_token", "", { maxAge: 0 });
      
      await whitelist.destroy()
      return res.status(200).json({
        message: "Logout successful",
        error: null,
        data: null,
      });
    }

    return res.status(404).json({
      message: "User not found",
      error: ["email"],
      data: null,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      data: null,
    });
  }
};

const changeSubscription = async (req: Request, res: Response) => {
  const { email, frequency, prompt } = req.body;

  try {

    const isChanged = await addSubsciberToSubscriptionService(email, frequency, prompt);
    if (!isChanged) {throw new Error("Failed to change user subscription");}

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { frequency, prompt },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return res.status(200).json({
      message: "User updated successfully",
      error: null,
      data: {
        email: updatedUser.email,
        frequency: updatedUser.frequency,
        prompt: updatedUser.prompt,
      },
    });

  } catch (error) {
    logger.error(`Error updating user: ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      data: null,
    });
  }
}

export { signup, whoIsMe, login, logout, changeSubscription };
