import createCronjob, { Period } from "./base";

const dailyJobs = createCronjob(Period.daily, async () => {

}, {

})

export default dailyJobs