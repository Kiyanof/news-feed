import NewsController from "../lib/Newspaper";
import createCronjob, { Period } from "./base";
import logger from "../config/logger";
import QDrantController from "../lib/v2/QDdrant";
import { QDRANT_URL } from "../config/qdrant.conf";

const dailyJobs = createCronjob(Period.daily, async () => {
    logger.defaultMeta = { label: 'cronjob ', period: 'daily' };

    try {
        logger.debug('Syncing news...');
        await new NewsController().syncNews()
        logger.info('News synced')
        logger.debug('Deleting old news from QDrant...');
        await new QDrantController(QDRANT_URL).deleteOldNews('news')
        logger.info('Old news deleted from QDrant')
        
    } catch (error) {
        logger.error(`Error syncing news: ${error}`)
    }
}, {
    // props
})

export default dailyJobs