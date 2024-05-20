import mongoose from "mongoose";

/**
 * Enum for frequency values
 * @enum {string}
 */
export enum Frequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

/**
 * Interface for user type
 * @interface
 */
export interface UserType {
  /** User's email */
  email: string;
  /** User's password */
  password: string;
  /** Frequency of user's subscription */
  frequency: Frequency;
  /** Prompt for user's subscription */
  prompt: string;
}

/**
 * Mongoose schema for user
 * @type {mongoose.Schema<UserType>}
 */
const UserSchema: mongoose.Schema<UserType> = new mongoose.Schema<UserType>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 10,
      maxlength: 50,
      validate: {
        validator: (v: string) => /\S+@\S+\.\S+/.test(v),
        message: "Email must be a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      // select: false, // Do not return password in query results
      minlength: 60, // bcrypt hashed password length
      maxlength: 60,
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Password must not be empty",
      },
    },
    frequency: {
      type: String,
      enum: Object.values(Frequency),
      required: true,
      validate: {
        validator: (v: string) => ["daily", "weekly", "monthly"].includes(v),
        message: "Frequency must be daily, weekly, or monthly",
      },
    },
    prompt: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 255,
      trim: true,
      validate: {
        validator: (v: string) => v.trim().length > 0,
        message: "Prompt must not be empty",
      },
    },
  },
  { timestamps: true }
);

/**
 * Mongoose model for user
 * @type {mongoose.Model<UserType>}
 */
const UserModel: mongoose.Model<UserType> = mongoose.model<UserType>(
  "User",
  UserSchema
);

export default UserModel;
