import createCronjob, { Period } from "./base";
import { Frequency } from "../utils/subscriber";
import logger from "../config/logger";
import { handleSubscribedUsersFeed } from "./jobs";

const weeklyJobs = createCronjob(Period.weekly, async () => {
    logger.defaultMeta = { label: 'cronjob ', period: 'weekly' };
    logger.info('Running daily cronjob...')
    handleSubscribedUsersFeed(
        Frequency.WEEKLY
    )
    logger.info('Daily cronjob completed')
}, {
    
})

export default weeklyJobs