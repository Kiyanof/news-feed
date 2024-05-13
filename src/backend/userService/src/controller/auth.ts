import { Request, Response } from "express";
import AppCrypto from "../lib/auth/crypto";
import logger from "../config/logger";
import TOKEN_CONFIG from "../config/token.config";
import UserModel from "../model/user";
import { setTokenCookie } from "../utils/user";
import Tokenizer, {Payload} from "../lib/auth/tokenizer";
import { createWhitelist } from "../utils/whitelist";

const whoIsMe = async (req: Request, res: Response) => {
  const {fingerPrint} = req.body
  logger.debug(`Verifying token... ${fingerPrint}`) // TODO: add it to verification process

  try {
    const tokenizer = Tokenizer.new()
    logger.debug(`Tokenizer: ${tokenizer}`)
    const whitelist = await createWhitelist(tokenizer)
    logger.debug(`Whitelist: ${whitelist}`)
    await whitelist.init()
    logger.debug(`Whitelist initialized`)

    logger.debug(`Access token: ${req.cookies.access_token}`)
    logger.debug(`Refresh token: ${req.cookies.refresh_token}`)
    const payload = await tokenizer.verify(req.cookies.access_token, req.cookies.refresh_token)
    if(!payload) {
      return res.status(401).json({
        message: "Unauthorized",
        error: ["token"],
        data: null,
      });
    }

    if('accessToken' in payload && 'refreshToken' in payload) {
      const {accessToken, refreshToken} = payload
      const response = setTokenCookie(res, payload)

      if(!accessToken || !refreshToken) {
        await whitelist.destroy()
        throw new Error("Invalid token generated!")
      }

      const payloadDate = await tokenizer.verify(accessToken, refreshToken) as Payload
      if(!payloadDate) {
        await whitelist.destroy()
        throw new Error("Invalid token generated verification!")
      }

      const userInformation = await UserModel.findOne({email: payloadDate.email})
      if(!userInformation) {
        await whitelist.destroy()
        throw new Error("User not found!")
      }

      await whitelist.destroy()
      return response.status(200).json({
        message: "Token verified",
        error: null,
        data: {
          email: payloadDate.email,
          frequency: userInformation.frequency,
          prompt: userInformation.prompt,
        },
      });
    }

    const userInformation = await UserModel.findOne({email: payload.email})
      if(!userInformation) {
        await whitelist.destroy()
        throw new Error("User not found!")
      }
    await whitelist.destroy()
    return res.status(200).json({
      message: "Token verified",
      error: null,
      data: {
        email: payload.email,
        frequency: userInformation.frequency,
        prompt: userInformation.prompt,
      },
    });  
  } catch (error) {
    logger.error(`Error verifying token: ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      data: null,
    });
  }
}

const signup = async (req: Request, res: Response) => {
  const { email, password, frequency, prompt, fingerPrint } = req.body;

  try {

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
    if (!newUser) {
      logger.warn(`Failed to create user: ${newUser}`)

      return res.status(500).json({
        message: "Internal server error",
        error: ["user"],
        data: null,
      });
    }
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
    const user = await UserModel.findOne({ email });
    if (!user) {
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

export { signup, whoIsMe, login, logout };
