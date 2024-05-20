import express from 'express'
import 'dotenv/config'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet'

import authRouter from './route/auth'
import appInit from './init/init'
import logger from './config/logger';

/**
 * The express app.
 * @description - The express app is the core of the server. It is responsible for handling requests and responses.
 */
const app = express()

/**
 * Parameters for server configuration.
 * @param {string | number} port - The port number on which the server will listen. Defaults to 8000 if not provided.
 */
const params = {
    port: process.env.APP_PORT || 8000
}

/**
 * Middleware setup.
 * @param helmet - Middleware to set various HTTP headers for security.
 * @description - This middleware sets various HTTP headers to protect the app from known web vulnerabilities.
 * @param cors - Middleware to enable CORS
 * @description - CORS is a security feature implemented in browsers that restricts requests to the same origin.
 * This middleware allows requests from the specified origin.
 * @param express.json - Middleware to parse JSON bodies.
 * @description - This middleware parses the JSON body of the request and makes it available in the request object.
 * @param express.urlencoded - Middleware to parse URL-encoded bodies.
 * @description - This middleware parses the URL-encoded body of the request and makes it available in the request object.
 * @param cookieParser - Middleware to parse cookies.
 * @description - This middleware parses the cookies in the request and makes them available in the request object.
 */
app.use(helmet())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

/**
 * Ping route.
 * @param _req - The request object.
 * @param res - The response object.
 * @description - This route is used to check if the server is running.
 */
app.get('/ping', (_req, res) => {
    res.send('pong')
})

/**
 * Initialize the app.
 * @description - This function initializes the app by setting up the database connection and other services.
 */
appInit()

/**
 * Routes setup.
 * @param authRouter - The router for authentication routes.
 * @description - This router handles all the routes related to authentication.
 */
app.use('/auth', authRouter)

/**
 * Start the server.
 * @param port - The port on which the server will listen.
 * @description - This function starts the server on the specified port.
 * It also logs a message to the console to indicate that the server has started.
 */
app.listen(params.port, () => {
    logger.info(`Server started on port ${params.port}`)
})