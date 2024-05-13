import { Frequency } from "src/utils/subscriber";
import logger from "../config/logger";
import createCronjob, { Period } from "./base";
import { handleSubscribedUsersFeed } from "./jobs";


const dailyJobs = createCronjob(Period.daily, async () => {
    logger.defaultMeta = { label: 'cronjob ', period: 'daily' };
    logger.info('Running daily cronjob...')
    handleSubscribedUsersFeed(
        Frequency.DAILY
    )
    logger.info('Daily cronjob completed')
}, {

})

export default dailyJobs