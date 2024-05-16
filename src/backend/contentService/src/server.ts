import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import logger from './config/logger';
import Ai, {Response} from "./utils/ai"
import OPENAI_CONFIG from './config/openai.config';
import appInit from './init/init';
// import upConsumers from './utils/broker/consumer/RPCs';


const app = express();

const appParams = {
    port: process.env.APP_PORT || 8002,
    openAiApiKey: process.env.OPENAI_API_KEY || ""
}

/**
 * Test the AI module
 * TODO: Remove this block after testing
 */
logger.info("Testing AI module")
const ai = new Ai(OPENAI_CONFIG.API_KEY)
const response: Promise<Response> = ai.getKeywords({content: "hello world!"})
logger.info(`AI response ::: ${response}`)

process.on("uncaughtException", (err) => {
    logger.error("uncaught exception! Shutting down...");
    logger.error(err.name);
    logger.error(err.message);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (_req, res) => {
  res.send('pong!');
});

try {
  appInit()
  logger.info("App initialized successfully")
} catch (error) {
  logger.error(`Error initializing app: ${error}`);
}
const server = app.listen(appParams.port, () => {
    logger.info(`Server is running on port ${appParams.port}`);
});

process.on("unhandledRejection", (err: Error) => {
    logger.error("UNHANDLED REJECTION! Shutting down...");
    logger.error("error ::: ", err?.name, err?.message, err);
    server.close(() => {
    process.exit(1);
    });
});