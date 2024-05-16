import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import appInit from './init/init';
import logger from './config/logger';

import newsRouter from './route/news';


const app = express();
const appParams = {
    port: process.env.APP_PORT || 8004
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
    appInit()
} catch (error) {
    logger.error(`Error initializing app: ${error}`);
}

app.use('/api/news', newsRouter)
app.listen(appParams.port, () => {
    logger.info(`Server is running on port ${appParams.port}`);
});

