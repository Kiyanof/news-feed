import cron from 'node-cron';

enum Period {
    daily = '0 0 * * *',
    weekly = '0 0 * * 0',
    monthly = '0 0 1 * *'
}

const createCronjob = (period: Period, callback: ({...props}: any) => any, {...props}: any) => {
    return cron.schedule(period, () => {
        return callback(props);
    });
}

export {
    Period
}
export default createCronjob;