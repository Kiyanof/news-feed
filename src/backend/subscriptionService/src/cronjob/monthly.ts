import createCronjob, { Period } from "./base";
import  { Frequency } from "../utils/subscriber";
import logger from "../config/logger";
import { handleSubscribedUsersFeed } from "./jobs";

const monthlyJobs = createCronjob(Period.monthly, async () => {
    logger.defaultMeta = { label: 'cronjob ', period: 'monthlu' };
    logger.info('Running daily cronjob...')
    handleSubscribedUsersFeed(
        Frequency.MONTHLY
    )
    logger.info('Daily cronjob completed')
}, {
    
})

export default monthlyJobs