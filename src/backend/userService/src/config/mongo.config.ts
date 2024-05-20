import { MongoConfig } from "../../index";

/**
 * @constant
 * @description Default configuration for MongoDB connection.
 * @default
 * @example
 * {
 *  PROTOCOL: 'mongodb',
 *  HOST: 'localhost',
 *  PORT: '27017',
 *  DB: 'temp',
 *  USER: '',
 *  PASSWORD: ''
 * }
 */
const DEFAULT_CONFIG: MongoConfig = {
    PROTOCOL: 'mongodb',
    HOST: 'localhost',
    PORT: '27017',
    DB: 'temp',
    USER: '',
    PASSWORD: '',
}

/**
 * @constant
 * @description Configuration for MongoDB connection, with environment variables overriding defaults.
 * @default DEFAULT_CONFIG
 * @type {MongoConfig}
 */
const MONGO_CONFIG: MongoConfig = {
    PROTOCOL: process.env.MONGO_PROTOCOL || DEFAULT_CONFIG.PROTOCOL,
    HOST: process.env.MONGO_HOST || DEFAULT_CONFIG.HOST,
    PORT: process.env.MONGO_PORT || DEFAULT_CONFIG.PORT,
    DB: process.env.MONGO_DB || DEFAULT_CONFIG.DB,
    USER: process.env.MONGO_USER || DEFAULT_CONFIG.USER,
    PASSWORD: process.env.MONGO_PASSWORD || DEFAULT_CONFIG.PASSWORD,
}

/**
 * @constant
 * @type {string}
 * @description URI for MongoDB connection, constructed from the MONGO_CONFIG object.
 * @example
 * mongodb://localhost:27017/temp
 * @description - This URI is used to connect to the MongoDB server.
 * It includes the protocol, host, port, and database name.
 * The protocol specifies the protocol used for the connection.
 * The host and port specify the location of the MongoDB server.
 * The database name specifies the name of the database to connect to.
 * The URI is used by the MongoDB client to establish a connection to the server.
 * The client uses the URI to connect to the server and perform operations on the database.
 */
export const MONGO_URI: string = `${MONGO_CONFIG.PROTOCOL}://${MONGO_CONFIG.HOST}:${MONGO_CONFIG.PORT}/${MONGO_CONFIG.DB}`
export default MONGO_CONFIG;