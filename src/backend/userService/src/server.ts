import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser';

import authRouter from './route/auth'
import appInit from './init/init'

const app = express()
/**
 * Parameters
 * @param port: number
 */
const params = {
    port: process.env.APP_PORT || 3000
}

/**
 * Middlewares
 */
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
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

appInit().then(() => {
    app.use('/auth', authRouter)
})

/**
 * Start server
 */

app.listen(params.port, () => {
    console.log(`Server is running on port ${params.port}`)
})