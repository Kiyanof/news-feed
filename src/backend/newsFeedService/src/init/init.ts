import mongoose from "mongoose";
import logger from "../config/logger"
import NewsController from "../lib/Newspaper";
import { MONGO_URI } from "../config/mongo.config";
import dailyJobs from "src/cronjob/daily";

const newsInit = async () => {
    logger.info('Initializing News Feed Service...');
    new NewsController().syncNews()
}

const initMongoEvents = () => {
    mongoose.connection.on("connected", () => logger.info("DB Connection established"));
    mongoose.connection.on("reconnect", () => logger.info("DB Connection reconnected"));
    mongoose.connection.on("disconnected", () => logger.info("DB Connection disconnected"));
    mongoose.connection.on("error", (error) => logger.error("DB Connection error", error.message));
}

const mongoInit = async () => {
    logger.info('Initializing MongoDB...');
    try {
        initMongoEvents()
        logger.debug(`MONGO_URI: ${MONGO_URI}`)
        const connection = await mongoose.connect(MONGO_URI)
        logger.debug(`Connection: ${connection}`)
        if(connection) {
            logger.info('MongoDB initialized')
        }
        return connection
    } catch (error) {
        logger.error(`Error initializing MongoDB: ${error}`)
        return null
    }
}

const handleCronJobs = () => {
    logger.info('Initializing cron jobs...')
    try {
        logger.debug('Daily cron job initializing...')
        dailyJobs.start()
        logger.debug('Daily cron job initialized')
        
    } catch (error) {
        logger.error(`Error initializing cron jobs: ${error}`)
    }
}

const handleSignals = () => {
    ['SIGINT', 'SIGTERM', 'SIGQUIT']
    .forEach(signal => process.on(signal, () => {
        logger.error("Force signal received...", signal);
        mongoose.connection.close(true);
        process.exit();
    }));

}

const appInit = async () => {
    logger.defaultMeta = { label: 'init ' };
    logger.info('Initializing...');
    await mongoInit()
    await newsInit()
    
    handleCronJobs()

    handleSignals()
}

export default appInit;