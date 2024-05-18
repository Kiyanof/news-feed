import NewsController from "../lib/Newspaper";
import createCronjob, { Period } from "./base";
import logger from "../config/logger";

const dailyJobs = createCronjob(Period.daily, async () => {
    logger.defaultMeta = { label: 'cronjob ', period: 'daily' };

    try {
        logger.debug('Syncing news...');
        await new NewsController().syncNews()
        logger.info('News synced')
        
    } catch (error) {
        logger.error(`Error syncing news: ${error}`)
    }
}, {
    // props
})

export default dailyJobs