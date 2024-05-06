import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import logger from './config/logger';
import appInit from './init/init';
// import upConsumers from './utils/broker/consumer/RPCs';


const app = express();

const appParams = {
    port: process.env.PORT || 8002,
}   

/**
 * Middleware
 */
app.use(cors()); // TODO: Add specific origin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */
app.get('/ping', (_req, res) => {
  res.send('pong!');
});

/**
 * Consumers
 */
// upConsumers();

/**
 * Initialize
 */
appInit();

app.listen(appParams.port, () => {
    logger.info(`Server is running on port ${appParams.port}`);
});