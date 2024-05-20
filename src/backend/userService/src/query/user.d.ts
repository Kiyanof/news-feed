/**
 * @fileoverview This file contains the types for the user model query.
 * @module userService/query/user
 * @requires mongoose
 * @requires userService/model/user
 */

/**
 * @enum {string}
 * @description Frequency options for user's preference.
 */
export enum Frequency {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
}

/**
 * @description The user information object.
 * @exports UserInformation
 * @example
 * {
 *    email: "foo@bar.com",
 *    hashPassword: "Njsdn32ojn109nniaNn123noin09NsaSasKMN92@0193mLn",
 *    frequency: "daily",
 *    prompt: "I am a prompt."
 * }
 */
export type UserInformation = {
  email: string;
  hashPassword: string;
  frequency: Frequency;
  prompt: string;
};


declare module "userService" {
  export function userIsExist(email: string): Promise<boolean>;
  export function getUserInformation(email: string): Promise<UserInformation>;
  export function addNewUser(email: string, password: string, frequency: Frequency, prompt: string): Promise<boolean>;
  export function updateSubscription(email: string, frequency: Frequency, prompt: string): Promise<boolean>;
}
