/**
 * Interface for token configuration
 * @interface Token
 * @description Interface for token configuration.
 * @property {string} SECRET - The secret used to sign the token.
 * @property {string} ALGORITHM - The algorithm used to sign the token.
 * @property {string} EXPIRES_IN - The expiration time of the token.
 */
export interface Token {
    SECRET: string;
    ALGORITHM: string;
    EXPIRES_IN: string;
}

/**
 * Interface for token configuration
 * @interface TokenConfig
 * @description Interface for token configuration.
 * @property {Token} ACCESS_TOKEN - Configuration for the access token.
 * @property {Token} REFRESH_TOKEN - Configuration for the refresh token.
 */
export interface TokenConfig {
    ACCESS_TOKEN: Token;
    REFRESH_TOKEN: Token;
}