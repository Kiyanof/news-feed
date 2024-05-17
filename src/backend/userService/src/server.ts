import express from 'express'
import 'dotenv/config'
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './route/auth'
import appInit from './init/init'
import logger from './config/logger';

const app = express()
/**
 * Parameters
 * @param port: number
 */
const params = {
    port: process.env.APP_PORT || 8000
}


/**
 * Middlewares
 */
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

/**
 * Routes
 */
app.get('/ping', (_req, res) => {
    res.send('pong')
})

appInit()

app.use('/auth', authRouter)


/**
 * Start server
 */

app.listen(params.port, () => {
    logger.info(`Server started on port ${params.port}`)
})