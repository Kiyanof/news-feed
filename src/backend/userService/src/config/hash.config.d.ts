/**
 * HashConfig interface.
 * @interface HashConfig
 * @description Interface for hash configuration.
 * @property {number} saltRounds - The number of salt rounds to use.
 * @example
 * const HASH_CONFIG = {
 *   saltRounds: 10
 * }
 */
export interface HashConfig {
    saltRounds: number;
}