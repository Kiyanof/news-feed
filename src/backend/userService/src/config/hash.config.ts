import { HashConfig } from "../../index";

/**
 * @constant
 * @description Default configuration for hashing passwords.
 * @default
 * @type {HashConfig}
 */
const DEFAULT_CONFIG: HashConfig = {
    saltRounds: 10
}

/**
 * @constant
 * @description Configuration for hashing passwords, with environment variables overriding defaults.
 * @default DEFAULT_CONFIG
 * @type {HashConfig}
 */
const HASH_CONFIG = {
    DEFAULT: {
        saltRounds: process.env.HASH_SALT_ROUNDS || DEFAULT_CONFIG.saltRounds
    }
}

export default HASH_CONFIG;